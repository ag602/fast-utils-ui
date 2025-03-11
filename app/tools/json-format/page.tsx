import { JsonFormatterPage as JsonFormatter } from "@/components/json-formatter-page"

export const metadata = {
  title: "JSON Formatter & Validator | Utilities",
  description: "Format, validate and beautify your JSON data with syntax highlighting",
}

export default function JsonFormatterPage() {
  return <JsonFormatter />
}