# AI Text Humanizer - Frontend

Next.js based frontend for the AI Text Humanizer application.

## Features

- ✅ Text input with character counting (300-5000 characters)
- ✅ Document upload (PDF, DOCX, PPTX, TXT)
  - Click to upload
  - Drag and drop support
  - File validation
- ✅ Parameter configuration (Length, Similarity, Style)
- ✅ Real-time text humanization using OpenAI API
- ✅ Result display with copy and download options
- ✅ Responsive design
- ✅ Dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# or
npm install
```

### Development

```bash
# Start development server
pnpm dev

# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Main page (text humanizer)
└── globals.css         # Global styles

components/
├── ui/                 # shadcn/ui components
│   ├── button.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   └── ...
└── FileUpload.tsx      # File upload component

lib/
├── api.ts              # API client
├── storage.ts          # LocalStorage utilities
└── utils.ts            # Utility functions

schemas/
└── humanize.ts         # Zod validation schemas

hooks/
├── useCharCount.ts     # Character counting hook
└── use-toast.ts        # Toast notification hook

types/
└── index.ts            # TypeScript type definitions
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:18201
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests (if configured)

## API Integration

### Humanize Text

```typescript
import { humanizeText } from "@/lib/api";

const response = await humanizeText({
  source: {
    mode: "text",
    text: "Your text here...",
  },
  params: {
    length: "Normal",
    similarity: "Moderate",
    style: "Friendly",
  },
});
```

### Upload File

```typescript
const formData = new FormData();
formData.append("file", file);

const response = await fetch("http://localhost:18201/api/v1/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
// data.text - Extracted text
// data.base64 - File as base64
```

## Components

### FileUpload

Reusable file upload component with drag & drop support.

```tsx
import { FileUpload } from "@/components/FileUpload";

<FileUpload
  onFileProcessed={(text, base64, filename) => {
    // Handle uploaded file
  }}
  disabled={false}
/>
```

**Features**:
- Click to select files
- Drag and drop
- File type validation
- Size validation (40MB max)
- Upload progress indicator
- Error handling with toast notifications

## Styling

The project uses TailwindCSS with custom theme configuration:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // ... custom colors
      },
    },
  },
};
```

## Form Validation

Using Zod for schema validation:

```typescript
// schemas/humanize.ts
export const humanizeSchema = z.object({
  mode: z.enum(["text", "document"]),
  text: z.string().min(300).max(5000),
  length: z.enum(["Normal", "Concise", "Expanded"]),
  similarity: z.enum(["Low", "Moderate", "High", "Neutral"]),
  style: z.enum([...]),
  customStyle: z.string().max(120).optional(),
});
```

## State Management

Using React hooks for state management:

- `useState` - Local component state
- `useForm` - Form state (React Hook Form)
- `useToast` - Toast notifications
- `useCharCount` - Character counting

## LocalStorage

History items are stored in browser localStorage:

```typescript
import { addHistoryItem, getHistoryItems } from "@/lib/storage";

// Add to history
addHistoryItem({
  preview: "Text preview...",
  fullText: "Full text...",
  outputText: "Humanized text...",
  timestamp: Date.now(),
  params: { ... },
});

// Get history
const history = getHistoryItems();
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

None at the moment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

See root project LICENSE file.

## Support

For issues or questions:
- Check the [main README](../../README.md)
- Review [FILE_UPLOAD_GUIDE.md](../../FILE_UPLOAD_GUIDE.md)
- Check the backend API docs at http://localhost:18201/docs

---

**Version**: 1.1.0  
**Last Updated**: 2025-10-23
