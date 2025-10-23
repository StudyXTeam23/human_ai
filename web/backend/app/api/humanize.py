"""Humanize API endpoints."""
from fastapi import APIRouter, HTTPException, status

from app.models.schemas import HumanizeRequest, HumanizeResponse
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/api/v1", tags=["humanize"])

# Initialize OpenAI service
openai_service = OpenAIService()


@router.post(
    "/humanize",
    response_model=HumanizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Humanize AI-generated text",
    description="Transform AI-generated text into more natural, human-like content",
)
async def humanize_text(request: HumanizeRequest) -> HumanizeResponse:
    """
    Humanize text endpoint.

    Args:
        request: HumanizeRequest with source text and parameters

    Returns:
        HumanizeResponse with humanized content

    Raises:
        HTTPException: If processing fails
    """
    try:
        result = await openai_service.humanize(
            text=request.source.text,
            length=request.params.length.value,
            similarity=request.params.similarity.value,
            style=request.params.style.value,
            custom_style=request.params.customStyle,
        )

        return HumanizeResponse(**result)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}",
        )

