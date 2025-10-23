"""Tests for Pydantic schemas."""
import pytest
from pydantic import ValidationError

from app.models.schemas import (
    HumanizeRequest,
    InputMode,
    Length,
    Similarity,
    Style,
)


def test_humanize_request_valid():
    """Test valid humanize request."""
    data = {
        "source": {"mode": "text", "text": "a" * 300},
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Neutral",
        },
    }
    request = HumanizeRequest(**data)
    assert request.source.mode == InputMode.TEXT
    assert request.params.length == Length.NORMAL


def test_humanize_request_text_too_short():
    """Test request with text too short."""
    data = {
        "source": {"mode": "text", "text": "short"},
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Neutral",
        },
    }
    with pytest.raises(ValidationError):
        HumanizeRequest(**data)


def test_humanize_request_custom_style_missing():
    """Test request with Custom style but no customStyle."""
    data = {
        "source": {"mode": "text", "text": "a" * 300},
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Custom",
        },
    }
    with pytest.raises(ValidationError) as exc_info:
        HumanizeRequest(**data)
    assert "custom style" in str(exc_info.value).lower()


def test_humanize_request_custom_style_provided():
    """Test request with Custom style and customStyle provided."""
    data = {
        "source": {"mode": "text", "text": "a" * 300},
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Custom",
            "customStyle": "Professional and concise",
        },
    }
    request = HumanizeRequest(**data)
    assert request.params.style == Style.CUSTOM
    assert request.params.customStyle == "Professional and concise"

