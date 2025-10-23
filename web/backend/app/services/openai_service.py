"""OpenAI service for text humanization using HTTP requests."""
import httpx
import logging
import time
import os
from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for interacting with OpenAI API via HTTP."""

    def __init__(self):
        """Initialize OpenAI service."""
        self.api_key = settings.openai_api_key
        self.model = settings.openai_model
        self.api_url = settings.openai_api_url

    def _build_prompt(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None = None,
    ) -> str:
        """
        Build prompt for text humanization based on parameters.

        Args:
            text: Original text to humanize
            length: Length parameter (Normal, Concise, Expanded)
            similarity: Similarity parameter (Low, Moderate, High, Neutral)
            style: Style parameter (Neutral, Academic, Business, etc.)
            custom_style: Custom style description if style is Custom

        Returns:
            str: Formatted prompt for OpenAI
        """
        # Base instruction
        prompt = "You are a text rewriting assistant. Rewrite the following text to make it sound more natural and human-like.\n\n"

        # Length instructions
        length_instructions = {
            "Normal": "Maintain approximately the same length as the original text.",
            "Concise": "Make the text more concise and to the point, reducing unnecessary words.",
            "Expanded": "Expand the text with more details and explanations.",
        }
        prompt += f"Length: {length_instructions.get(length, length_instructions['Normal'])}\n"

        # Similarity instructions
        similarity_instructions = {
            "Low": "Feel free to significantly rephrase and restructure the content while maintaining the core meaning.",
            "Moderate": "Moderately rephrase the content, balancing between originality and similarity.",
            "High": "Stay very close to the original phrasing, making only minor adjustments for naturalness.",
            "Neutral": "Use balanced similarity to the original text.",
        }
        prompt += f"Similarity: {similarity_instructions.get(similarity, similarity_instructions['Neutral'])}\n"

        # Style instructions
        if style == "Custom" and custom_style:
            prompt += f"Style: {custom_style}\n"
        else:
            style_instructions = {
                "Neutral": "Use a neutral, balanced tone.",
                "Academic": "Use formal academic language with proper terminology.",
                "Business": "Use professional business communication style.",
                "Creative": "Use creative and engaging language.",
                "Technical": "Use technical and precise language.",
                "Friendly": "Use warm and friendly conversational tone.",
                "Informal": "Use casual and relaxed language.",
                "Reference": "Use objective and informative reference style.",
            }
            prompt += f"Style: {style_instructions.get(style, style_instructions['Neutral'])}\n"

        # Add the original text
        prompt += f"\n原文:\n{text}\n\n请直接输出改写后的文本,不要包含任何解释或额外说明:"

        return prompt

    async def humanize(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str | None = None,
        file_data: dict | None = None,
    ) -> dict:
        """
        Humanize text using OpenAI API.

        Args:
            text: Text to humanize
            length: Length parameter
            similarity: Similarity parameter
            style: Style parameter
            custom_style: Custom style description
            file_data: Optional dict with 'filename' and 'base64_content' for file-based requests

        Returns:
            dict: Response with content, character count, and processing time

        Raises:
            ValueError: If API request fails
        """
        start_time = time.time()
        
        try:
            # If file_data is provided, use file-based message format
            if file_data:
                # Build prompt for file mode
                prompt = self._build_prompt(text, length, similarity, style, custom_style)
                
                # Get file extension to determine MIME type
                filename = file_data.get('filename', 'document.pdf')
                ext = filename.lower().split('.')[-1]
                mime_types = {
                    'pdf': 'application/pdf',
                    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'txt': 'text/plain'
                }
                mime_type = mime_types.get(ext, 'application/octet-stream')
                
                # Prepare file-based payload
                payload = {
                    "model": self.model,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "file",
                                    "file": {
                                        "filename": filename,
                                        "file_data": f"data:{mime_type};base64,{file_data['base64_content']}"
                                    }
                                }
                            ]
                        },
                        {
                            "role": "assistant",
                            "content": [
                                {
                                    "type": "text",
                                    "text": f"I understand. This is the extracted content from {filename}:\n\n{text[:500]}..."
                                }
                            ]
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_completion_tokens": 4000,
                    "response_format": {"type": "text"}
                }
            else:
                # Standard text-based request
                prompt = self._build_prompt(text, length, similarity, style, custom_style)
                
                payload = {
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a professional text rewriting assistant that makes AI-generated text sound more natural and human-like.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4000,
                }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            }

            # Make HTTP request using httpx
            # Use system proxy settings from environment (trust_env=True is default)
            # This allows the use of HTTP_PROXY, HTTPS_PROXY, or system proxy settings
            async with httpx.AsyncClient(timeout=120.0) as client:
                logger.info(f"Calling OpenAI API: {self.api_url}")
                logger.debug(f"Request payload: model={payload['model']}, messages_count={len(payload['messages'])}, temperature={payload['temperature']}")
                
                response = await client.post(
                    self.api_url, json=payload, headers=headers
                )

                logger.info(f"OpenAI API response status: {response.status_code}")
                
                if response.status_code != 200:
                    logger.error(
                        f"OpenAI API error: {response.status_code} - {response.text}"
                    )
                    raise ValueError(
                        f"OpenAI API request failed with status {response.status_code}: {response.text}"
                    )

                result = response.json()
                logger.info(f"OpenAI API response received")

                # Extract the rewritten text
                if "choices" not in result or len(result["choices"]) == 0:
                    raise ValueError("No response from OpenAI API")

                rewritten_text = result["choices"][0]["message"]["content"].strip()
                
                # Calculate processing time
                processing_time = int((time.time() - start_time) * 1000)

                return {
                    "content": rewritten_text,
                    "chars": len(rewritten_text),
                    "processingTime": processing_time
                }

        except httpx.TimeoutException as e:
            logger.error(f"OpenAI API request timeout: {e}")
            raise ValueError("Request timeout - please try again")
        except httpx.ConnectError as e:
            logger.error(f"OpenAI API connection error (check proxy settings): {e}")
            raise ValueError(f"Connection failed - please check network/proxy settings: {str(e)}")
        except httpx.RequestError as e:
            logger.error(f"OpenAI API request error: {e}", exc_info=True)
            raise ValueError(f"Request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in OpenAI service: {e}", exc_info=True)
            raise ValueError(f"Failed to process text: {str(e)}")

