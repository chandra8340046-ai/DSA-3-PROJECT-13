"""
Document Service Module
Manages text document ingestion, file uploads, deletion, normalization, and sentinel concatenation.
Academic DSA 3 Reference Implementation.
"""
import os
import shutil
from typing import List, Dict, Tuple, Any

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "documents"))

class DocumentService:
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Returns list of all available document files with metadata."""
        docs = []
        if not os.path.exists(self.data_dir):
            return docs

        for filename in sorted(os.listdir(self.data_dir)):
            if filename.endswith(".txt"):
                file_path = os.path.join(self.data_dir, filename)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    stat = os.stat(file_path)
                    docs.append({
                        "id": filename,
                        "name": filename,
                        "size_bytes": stat.st_size,
                        "char_count": len(content),
                        "status": "Indexed",
                        "content": content
                    })
                except Exception as e:
                    docs.append({
                        "id": filename,
                        "name": filename,
                        "size_bytes": 0,
                        "char_count": 0,
                        "status": f"Error: {str(e)}",
                        "content": ""
                    })
        return docs

    def upload_document(self, filename: str, content_bytes: bytes) -> Dict[str, Any]:
        """Saves an uploaded UTF-8 text document."""
        file_path = os.path.join(self.data_dir, filename)
        content_str = content_bytes.decode("utf-8", errors="ignore")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content_str)

        return {
            "name": filename,
            "size_bytes": len(content_bytes),
            "char_count": len(content_str),
            "status": "Uploaded"
        }

    def delete_document(self, filename: str) -> bool:
        """Deletes a document file."""
        file_path = os.path.join(self.data_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False

    def build_concatenated_corpus(self) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Concatenates all text documents into a single corpus with sentinel separators.
        
        Returns:
            Tuple[combined_text, doc_offsets]
        """
        documents = self.get_all_documents()
        combined_text_parts = []
        doc_offsets = []
        current_offset = 0

        for idx, doc in enumerate(documents):
            # Unique sentinel character for each document boundary (\x01, \x02, ...)
            sentinel = chr(1 + (idx % 30))
            doc_text = doc["content"]
            
            start_pos = current_offset
            combined_text_parts.append(doc_text)
            current_offset += len(doc_text)
            end_pos = current_offset

            # Append sentinel separator
            combined_text_parts.append(sentinel)
            current_offset += 1

            doc_offsets.append({
                "doc_id": doc["id"],
                "name": doc["name"],
                "start": start_pos,
                "end": end_pos,
                "sentinel": repr(sentinel),
                "content": doc_text
            })

        combined_text = "".join(combined_text_parts)
        return combined_text, doc_offsets
