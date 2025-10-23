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
            "你是一位专业的文本改写专家。请将下面的 AI 生成文本改写成更自然、"
            "更具人类风格的内容,使其读起来更流畅、更真实。\n\n"
        )

        # Length instruction
        length_instructions = {
            "Normal": "保持原文长度,不要明显增加或减少字数。",
            "Concise": "简化内容,使文本更简洁,去除冗余信息,保留核心要点。",
            "Expanded": "扩展内容,添加更多细节、例子或解释,使文本更丰富完整。",
        }

        # Similarity instruction
        similarity_instructions = {
            "Low": "可以大幅改写,改变句式结构和用词,但保持核心意思。",
            "Moderate": "适度改写,保持大部分原文结构,优化表达方式。",
            "High": "轻微改写,主要优化用词和语气,尽量保持原文结构。",
            "Neutral": "根据内容自然改写,平衡保持原意和优化表达。",
        }

        # Style instruction
        style_instructions = {
            "Neutral": "使用中性、平衡的语气,适合大多数场景。",
            "Academic": "使用学术化、正式的语言风格,避免口语化表达。",
            "Business": "使用专业、商务的语气,简洁明了、重点突出。",
            "Creative": "使用创意性、富有想象力的表达,增加文学色彩。",
            "Technical": "使用技术性、精确的语言,专业术语准确。",
            "Friendly": "使用友好、亲切的语气,像朋友间的对话。",
            "Informal": "使用轻松、非正式的语言,更口语化。",
            "Reference": "使用参考性、信息性的语气,客观中立。",
            "Custom": f"使用以下自定义风格: {custom_style}",
        }

        # Build complete prompt
        prompt = (
            f"{base_instruction}"
            f"**改写要求:**\n"
            f"1. 长度: {length_instructions.get(length, length_instructions['Normal'])}\n"
            f"2. 相似度: {similarity_instructions.get(similarity, similarity_instructions['Neutral'])}\n"
            f"3. 风格: {style_instructions.get(style, style_instructions['Neutral'])}\n\n"
            f"**重要规则:**\n"
            f"- 保持原文的核心意思和关键信息\n"
            f"- 使文本更自然、流畅、易读\n"
            f"- 避免机械化、模板化的表达\n"
            f"- 确保语法正确、逻辑清晰\n"
            f"- 直接输出改写后的文本,不要添加任何解释或前缀\n\n"
            f"**原文:**\n{text}\n\n"
            f"**改写后的文本:**"
        )

        return prompt

