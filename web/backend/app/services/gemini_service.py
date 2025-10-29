"""Gemini API service for text humanization."""
import time
import logging
import google.generativeai as genai
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for Gemini API integration."""

    def __init__(self):
        """Initialize Gemini service with API key."""
        try:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(
                settings.gemini_model,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 8192,
                }
            )
            logger.info(f"Gemini service initialized with model: {settings.gemini_model}")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {e}")
            raise

    def humanize(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None = None,
    ) -> Dict[str, Any]:
        """
        Humanize text using Gemini API.

        Args:
            text: Input text to humanize
            length: Length option (Normal/Concise/Expanded)
            similarity: Similarity level (Low/Moderate/High/Neutral)
            style: Writing style
            custom_style: Custom style description if style is Custom

        Returns:
            Dictionary with content, chars, and processingTime
        """
        start_time = time.time()

        # Build the prompt based on parameters
        prompt = self._build_prompt(text, length, similarity, style, custom_style)

        try:
            logger.info(f"Calling Gemini API with {len(text)} chars, style: {style}")
            
            # Call Gemini API with timeout handling
            response = self.model.generate_content(
                prompt,
                request_options={"timeout": 30}  # 30 seconds timeout
            )
            
            logger.info(f"Gemini API responded successfully")
            
            # Extract the generated text
            if response.text:
                humanized_text = response.text.strip()
            else:
                logger.warning("Gemini returned empty response")
                raise ValueError("Gemini API returned empty response")

            processing_time = int((time.time() - start_time) * 1000)
            
            logger.info(f"Processing completed in {processing_time}ms, output: {len(humanized_text)} chars")

            return {
                "content": humanized_text,
                "chars": len(humanized_text.encode("utf-8")),
                "processingTime": processing_time,
            }

        except Exception as e:
            processing_time = int((time.time() - start_time) * 1000)
            logger.error(f"Gemini API error after {processing_time}ms: {str(e)}")
            raise ValueError(f"Gemini API error: {str(e)}")

    def _build_prompt(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None,
    ) -> str:
        """
        Build the prompt for Gemini API based on user parameters.

        Args:
            text: Original text
            length: Length preference
            similarity: Similarity preference
            style: Writing style
            custom_style: Custom style description

        Returns:
            Formatted prompt string
        """
        # Base instruction
        base_instruction = (
            "You are a professional text rewriting expert. Please rewrite the following AI-generated text "
            "into more natural, human-like content that reads more smoothly and authentically.\n\n"
        )

        # Length instruction
        length_instructions = {
            "Normal": "Maintain approximately the same length as the original text.",
            "Concise": "Simplify content, make the text more concise, remove redundant information, keep core points.",
            "Expanded": "Expand content, add more details, examples or explanations, make the text richer and more complete.",
        }

        # Similarity instruction
        similarity_instructions = {
            "Low": "Feel free to significantly rewrite, change sentence structure and word choice, but maintain the core meaning.",
            "Moderate": "Moderately rewrite, keep most of the original structure, optimize expression.",
            "High": "Slightly rewrite, mainly optimize word choice and tone, try to maintain the original structure.",
            "Neutral": "Naturally rewrite based on content, balance maintaining original meaning and optimizing expression.",
        }

        # Style instruction
        style_instructions = {
            "Neutral": "Use a neutral, balanced tone suitable for most scenarios.",
            "Academic": "Use academic, formal language style, avoid colloquial expressions.",
            "Business": "Use professional, business tone, concise and clear with emphasis on key points.",
            "Creative": "Use creative, imaginative expressions, add literary appeal.",
            "Technical": "Use technical, precise language with accurate terminology.",
            "Friendly": "Use friendly, warm tone like a conversation between friends.",
            "Informal": "Use relaxed, informal language, more conversational.",
            "Reference": "Use referential, informative tone that is objective and neutral.",
            "Custom": f"Use the following custom style: {custom_style}",
        }

        # Build complete prompt
        prompt = (
            f"{base_instruction}"
            f"**Rewriting Requirements:**\n"
            f"1. Length: {length_instructions.get(length, length_instructions['Normal'])}\n"
            f"2. Similarity: {similarity_instructions.get(similarity, similarity_instructions['Neutral'])}\n"
            f"3. Style: {style_instructions.get(style, style_instructions['Neutral'])}\n\n"
            f"**Important Rules:**\n"
            f"- Maintain the core meaning and key information of the original text\n"
            f"- Make the text more natural, flowing, and readable\n"
            f"- Avoid mechanical, template-like expressions\n"
            f"- Ensure correct grammar and clear logic\n"
            f"- Output only the rewritten text directly, without adding any explanation or prefix\n\n"
            f"**Original Text:**\n{text}\n\n"
            f"**Rewritten Text:**"
        )

        return prompt

