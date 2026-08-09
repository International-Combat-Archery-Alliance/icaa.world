import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { EditorConfig } from '@editorjs/editorjs/types/configs';

export default function useEditor(config: EditorConfig) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorInstance = useRef<EditorJS>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...config,
        onReady: () => {
          setIsEditorReady(true);
          config.onReady?.();
        },
      });
    }
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return {
    isEditorReady,
    editor: editorInstance.current,
  };
}
