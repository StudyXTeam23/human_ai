"""File upload API endpoints."""
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from typing import Dict
import logging

from app.services.file_processor import FileProcessor

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["upload"])

file_processor = FileProcessor()


@router.post(
    "/upload",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK,
    summary="Upload and process document",
    description="Upload a document file (PDF, DOCX, PPTX, TXT) and extract text content",
)
async def upload_file(file: UploadFile = File(...)) -> Dict[str, str]:
    """
    Upload and process document file.

    Args:
        file: Uploaded file

    Returns:
        Dict with extracted text and base64 encoded file

    Raises:
        HTTPException: If upload or processing fails
    """
    try:
        # Read file content
        content = await file.read()
        file_size = len(content)

        # Validate file
        file_processor.validate_file(file.filename or "unknown", file_size)

        # Save file to local storage
        file_path = file_processor.save_file(file.filename or "unknown", content)

        # Process file and extract text
        extracted_text, base64_content = file_processor.process_file(file_path)

        logger.info(
            f"File uploaded and processed: {file.filename}, size: {file_size} bytes, "
            f"extracted: {len(extracted_text)} characters"
        )

        return {
            "filename": file.filename or "unknown",
            "text": extracted_text,
            "base64": base64_content,
            "size": str(file_size),
            "chars": str(len(extracted_text)),
            "file_path": file_path,  # Return file path for later use
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}",
        )

