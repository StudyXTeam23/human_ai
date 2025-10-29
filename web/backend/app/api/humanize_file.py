"""Humanize file API endpoint - handles file-based humanization."""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import logging
import base64
from pathlib import Path

from app.models.schemas import Params, HumanizeResponse
from app.services.openai_service import OpenAIService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["humanize-file"])

# Initialize OpenAI service
openai_service = OpenAIService()


class HumanizeFileRequest(BaseModel):
    """Request model for file-based humanization."""
    
    file_path: str = Field(..., description="Path to the uploaded file")
    text: str = Field(
        default="", 
        description="Extracted text from file. If empty, will use file base64 instead"
    )
    params: Params = Field(..., description="Processing parameters")


@router.post(
    "/humanize-file",
    response_model=HumanizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Humanize file content",
    description="Humanize text from uploaded file, sending file as base64 to OpenAI",
)
async def humanize_file(request: HumanizeFileRequest) -> HumanizeResponse:
    """
    Humanize file content.
    
    This endpoint supports two modes:
    1. **Text mode** (request.text not empty):
       - Uses the extracted text for humanization
       - Faster and more efficient
       
    2. **File base64 mode** (request.text is empty):
       - Converts file to base64
       - Sends base64 to OpenAI for processing
       - Useful for files with complex formatting
    
    Args:
        request: HumanizeFileRequest with file path, optional text, and parameters
        
    Returns:
        HumanizeResponse with humanized content
        
    Raises:
        HTTPException: If processing fails
    """
    try:
        # Verify file exists
        file_path = Path(request.file_path)
        if not file_path.exists():
            raise ValueError(f"File not found: {request.file_path}")
        
        # Read and encode file to base64
        with open(file_path, "rb") as f:
            file_content = f.read()
            file_base64 = base64.b64encode(file_content).decode("utf-8")
        
        logger.info(
            f"Processing file: {file_path.name}, "
            f"text length: {len(request.text)}, "
            f"base64 length: {len(file_base64)}"
        )
        
        # Determine transfer mode based on whether text is empty:
        # - text not empty: only pass text (text mode)
        # - text empty: pass file_data (file base64 mode)
        has_text = bool(request.text and request.text.strip())
        
        if has_text:
            logger.info(f"Using text mode: {len(request.text)} characters")
            # Text mode: only pass extracted text
            try:
                result = await openai_service.humanize(
                    text=request.text,
                    length=request.params.length.value,
                    similarity=request.params.similarity.value,
                    style=request.params.style.value,
                    custom_style=request.params.customStyle,
                    file_data=None  # Don't pass file data
                )
            except Exception as openai_error:
                logger.error(f"OpenAI service error (text mode): {openai_error}", exc_info=True)
                raise
        else:
            logger.info(f"Using file base64 mode: {len(file_base64)} characters")
            # File mode: pass base64 encoded file
            try:
                result = await openai_service.humanize(
                    text="",  # Empty text
                    length=request.params.length.value,
                    similarity=request.params.similarity.value,
                    style=request.params.style.value,
                    custom_style=request.params.customStyle,
                    file_data={
                        'filename': file_path.name,
                        'base64_content': file_base64
                    }
                )
            except Exception as openai_error:
                logger.error(f"OpenAI service error (file mode): {openai_error}", exc_info=True)
                raise
        
        logger.info(
            f"File humanization completed: {file_path.name}, "
            f"output length: {result['chars']}"
        )
        
        return HumanizeResponse(**result)
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File not found: {str(e)}",
        )
    except Exception as e:
        logger.error(f"File humanization failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}",
        )

