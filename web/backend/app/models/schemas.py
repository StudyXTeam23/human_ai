"""Pydantic models for request/response validation."""
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class InputMode(str, Enum):
    """Input mode enumeration."""

    TEXT = "text"
    DOCUMENT = "document"


class Length(str, Enum):
    """Length option enumeration."""

    NORMAL = "Normal"
    CONCISE = "Concise"
    EXPANDED = "Expanded"


class Similarity(str, Enum):
    """Similarity option enumeration."""

    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    NEUTRAL = "Neutral"


class Style(str, Enum):
    """Style option enumeration."""

    NEUTRAL = "Neutral"
    ACADEMIC = "Academic"
    BUSINESS = "Business"
    CREATIVE = "Creative"
    TECHNICAL = "Technical"
    FRIENDLY = "Friendly"
    INFORMAL = "Informal"
    REFERENCE = "Reference"
    CUSTOM = "Custom"


class Source(BaseModel):
    """Source data model."""

    mode: InputMode = Field(..., description="Input mode (text or document)")
    text: str = Field(
        ...,
        description="Text content",
        examples=["The rain tapped gently against the window pane..." * 10],
    )
    
    @field_validator("text")
    @classmethod
    def validate_text_length(cls, v: str, info) -> str:
        """Validate text length based on mode."""
        data = info.data
        # Only validate length for text mode, not document mode
        if "mode" in data and data["mode"] == InputMode.TEXT:
            if len(v) < 300:
                raise ValueError("Text must be at least 300 characters for text mode")
            if len(v) > 5000:
                raise ValueError("Text must not exceed 5000 characters for text mode")
        return v


class Params(BaseModel):
    """Parameters model."""

    length: Length = Field(..., description="Output length option")
    similarity: Similarity = Field(..., description="Similarity to original")
    style: Style = Field(..., description="Writing style")
    customStyle: Optional[str] = Field(
        None,
        max_length=120,
        description="Custom style description (required when style is Custom)",
        examples=["Professional and concise"],
    )

    @field_validator("customStyle")
    @classmethod
    def validate_custom_style(cls, v: Optional[str], info) -> Optional[str]:
        """Validate custom style is provided when style is Custom."""
        # Access the entire model data
        data = info.data
        if "style" in data and data["style"] == Style.CUSTOM:
            if not v:
                raise ValueError("Custom style description is required when style is Custom")
        return v


class HumanizeRequest(BaseModel):
    """Request model for humanize endpoint."""

    source: Source = Field(..., description="Source text data")
    params: Params = Field(..., description="Processing parameters")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "source": {
                        "mode": "text",
                        "text": "The rain tapped gently against the window pane, "
                        "a soothing rhythm that calmed my restless soul. "
                        "Curled up by the fireplace with a good book, "
                        "I felt a profound sense of peace wash over me. " * 5,
                    },
                    "params": {
                        "length": "Normal",
                        "similarity": "Moderate",
                        "style": "Neutral",
                    },
                }
            ]
        }
    }


class HumanizeResponse(BaseModel):
    """Response model for humanize endpoint."""

    content: str = Field(..., description="Humanized text content")
    chars: int = Field(..., description="Character count of output", ge=0)
    processingTime: int = Field(
        ..., description="Processing time in milliseconds", ge=0, examples=[850]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "content": "Rain gently tapped against the window...",
                    "chars": 1234,
                    "processingTime": 850,
                }
            ]
        }
    }

