"""OpenAI service for text humanization using HTTP requests."""
import httpx
import logging
import time
import os
import tiktoken
from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for interacting with OpenAI API via HTTP."""
    
    # Token limits for different models
    MAX_CONTEXT_TOKENS = 128000  # gpt-4o and gpt-4o-mini max context
    MAX_OUTPUT_TOKENS = 4000     # Reserve for output
    MAX_INPUT_TOKENS = MAX_CONTEXT_TOKENS - MAX_OUTPUT_TOKENS - 1000  # Reserve 1000 for prompt and overhead

    def __init__(self):
        """Initialize OpenAI service."""
        self.api_key = settings.openai_api_key
        self.model = settings.openai_model
        self.api_url = settings.openai_api_url
        
        # Initialize tokenizer for the model
        try:
            self.encoding = tiktoken.encoding_for_model(self.model)
        except KeyError:
            # Fallback to cl100k_base encoding (used by gpt-4 and gpt-3.5-turbo)
            logger.warning(f"Model {self.model} not found, using cl100k_base encoding")
            self.encoding = tiktoken.get_encoding("cl100k_base")

    def _count_tokens(self, text: str) -> int:
        """Count the number of tokens in a text string."""
        try:
            return len(self.encoding.encode(text))
        except Exception as e:
            logger.error(f"Error counting tokens: {e}")
            # Fallback: rough estimate (1 token ≈ 4 characters for English, 1-2 for Chinese)
            return len(text) // 2

    def _truncate_text(self, text: str, max_tokens: int) -> tuple[str, bool]:
        """
        Truncate text to fit within token limit.
        
        Returns:
            tuple: (truncated_text, was_truncated)
        """
        try:
            tokens = self.encoding.encode(text)
            
            if len(tokens) <= max_tokens:
                return text, False
            
            # Truncate tokens
            truncated_tokens = tokens[:max_tokens]
            truncated_text = self.encoding.decode(truncated_tokens)
            
            logger.warning(
                f"Text truncated from {len(tokens)} tokens to {max_tokens} tokens"
            )
            
            return truncated_text, True
            
        except Exception as e:
            logger.error(f"Error truncating text: {e}")
            # Fallback: character-based truncation
            char_limit = max_tokens * 2  # Rough estimate
            if len(text) > char_limit:
                return text[:char_limit], True
            return text, False

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
            # Check and truncate text if necessary
            text_tokens = self._count_tokens(text)
            logger.info(f"Input text tokens: {text_tokens}")
            
            was_truncated = False
            if text_tokens > self.MAX_INPUT_TOKENS:
                text, was_truncated = self._truncate_text(text, self.MAX_INPUT_TOKENS)
                logger.warning(
                    f"Text was truncated to {self.MAX_INPUT_TOKENS} tokens "
                    f"(original: {text_tokens} tokens)"
                )
            
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
                        {"role": "system", "content": "You are a professional text rewriting assistant that makes AI-generated text sound more natural and human-like."},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4000,
                }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            }
            
            # Log request details
            prompt_tokens = self._count_tokens(prompt)
            logger.info(f"Total prompt tokens: {prompt_tokens}")
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(self.api_url, json=payload, headers=headers)
                response.raise_for_status()
                result = response.json()
                rewritten_text = result["choices"][0]["message"]["content"].strip()
                processing_time = int((time.time() - start_time) * 1000)
                
                # Add truncation warning to result if text was truncated
                response_data = {
                    "content": rewritten_text,
                    "chars": len(rewritten_text),
                    "processingTime": processing_time
                }
                
                if was_truncated:
                    truncation_notice = (
                        "\n\n[注意: 原始文本过长已被截断。"
                        f"原始约 {text_tokens:,} tokens，已截断至 {self.MAX_INPUT_TOKENS:,} tokens]"
                    )
                    response_data["content"] = rewritten_text + truncation_notice
                    response_data["wasTruncated"] = True
                    response_data["originalTokens"] = text_tokens
                
                return response_data
                
        except httpx.TimeoutException as e:
            logger.error(f"OpenAI API request timeout: {e}")
            raise ValueError("Request timeout - please try again")
        except httpx.ConnectError as e:
            logger.error(f"OpenAI API connection error (check proxy settings): {e}")
            raise ValueError(f"Connection failed - please check network/proxy settings: {str(e)}")
        except httpx.HTTPStatusError as e:
            logger.error(f"OpenAI API HTTP error: {e.response.status_code} - {e.response.text}")
            try:
                error_detail = e.response.json()
                error_msg = error_detail.get("error", {}).get("message", str(e))
            except:
                error_msg = e.response.text
            raise ValueError(f"OpenAI API request failed with status {e.response.status_code}: {error_msg}")
        except httpx.RequestError as e:
            logger.error(f"OpenAI API request error: {e}", exc_info=True)
            raise ValueError(f"Request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in OpenAI service: {e}", exc_info=True)
            raise ValueError(f"Failed to process text: {str(e)}")
