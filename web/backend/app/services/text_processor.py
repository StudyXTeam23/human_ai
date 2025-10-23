"""Text processing service with mock AI humanization."""
import random
import time
from typing import Dict, Any


class TextProcessorService:
    """Service for text humanization processing (mock implementation)."""

    def humanize(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None = None,
    ) -> Dict[str, Any]:
        """
        Humanize text based on parameters.

        In a real implementation, this would call an AI model.
        This is a mock implementation for demonstration purposes.

        Args:
            text: Input text to humanize
            length: Length option (Normal/Concise/Expanded)
            similarity: Similarity level
            style: Writing style
            custom_style: Custom style description if style is Custom

        Returns:
            Dictionary with content, chars, and processingTime
        """
        # Simulate processing delay (800-1200ms)
        delay = random.randint(800, 1200) / 1000
        time.sleep(delay)

        # Mock transformation
        processed_text = self._mock_transform(text, length, similarity, style, custom_style)

        return {
            "content": processed_text,
            "chars": len(processed_text.encode("utf-8")),
            "processingTime": int(delay * 1000),
        }

    def _mock_transform(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None,
    ) -> str:
        """
        Mock text transformation logic.

        In production, this would call actual AI models.
        """
        result = text

        # Apply length transformation
        if length == "Concise":
            result = self._shorten_text(result)
        elif length == "Expanded":
            result = self._expand_text(result)

        # Apply style transformation
        if style == "Academic":
            result = self._apply_academic_style(result)
        elif style == "Business":
            result = self._apply_business_style(result)
        elif style == "Creative":
            result = self._apply_creative_style(result)
        elif style == "Technical":
            result = self._apply_technical_style(result)
        elif style == "Friendly":
            result = self._apply_friendly_style(result)
        elif style == "Informal":
            result = self._apply_informal_style(result)
        elif style == "Custom" and custom_style:
            result = f"[{custom_style}] {result}"

        # Apply similarity adjustment (subtle changes)
        if similarity in ["Low", "Moderate"]:
            result = self._add_variation(result)

        return result

    def _shorten_text(self, text: str) -> str:
        """Shorten text by reducing sentences."""
        sentences = text.split(". ")
        target_count = max(1, len(sentences) // 2)
        return ". ".join(sentences[:target_count]) + "."

    def _expand_text(self, text: str) -> str:
        """Expand text by adding elaborations."""
        expansions = [
            " This is particularly noteworthy in the current context.",
            " It's worth mentioning that this creates a unique atmosphere.",
            " The implications of this are quite significant.",
            " This aspect deserves further consideration.",
        ]
        return text + random.choice(expansions)

    def _apply_academic_style(self, text: str) -> str:
        """Apply academic writing style."""
        replacements = {
            "it's": "it is",
            "can't": "cannot",
            "don't": "do not",
            "won't": "will not",
            "I think": "It can be argued that",
            "very": "notably",
        }
        result = text
        for old, new in replacements.items():
            result = result.replace(old, new)
        return result

    def _apply_business_style(self, text: str) -> str:
        """Apply business writing style."""
        result = text.replace("I believe", "Our analysis suggests")
        result = result.replace("maybe", "potentially")
        result = result.replace("a lot of", "substantial")
        return result

    def _apply_creative_style(self, text: str) -> str:
        """Apply creative writing style."""
        result = text.replace("walked", "strolled")
        result = result.replace("looked", "gazed")
        result = result.replace("said", "expressed")
        return result

    def _apply_technical_style(self, text: str) -> str:
        """Apply technical writing style."""
        result = text.replace("about", "approximately")
        result = result.replace("use", "utilize")
        result = result.replace("show", "demonstrate")
        return result

    def _apply_friendly_style(self, text: str) -> str:
        """Apply friendly writing style."""
        result = text.replace("Hello", "Hi there")
        result = result.replace("Please", "Please feel free to")
        return result + " Hope this helps!"

    def _apply_informal_style(self, text: str) -> str:
        """Apply informal writing style."""
        result = text.replace("it is", "it's")
        result = result.replace("cannot", "can't")
        result = result.replace(".", "!")
        return result

    def _add_variation(self, text: str) -> str:
        """Add subtle variations to text."""
        variations = [
            ("the", "the very"),
            ("and", "and also"),
            ("is", "appears to be"),
        ]
        result = text
        for old, new in random.sample(variations, min(2, len(variations))):
            result = result.replace(old, new, 1)
        return result

