'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Loader2, AlertCircle } from 'lucide-react';

type SheetData = unknown[][];

interface ExcelViewerProps {
  fileUrl: string | File | Blob;
}

export const ExcelViewer: React.FC<ExcelViewerProps> = ({ fileUrl }) => {
  const [sheets, setSheets] = useState<Record<string, SheetData>>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(() => Boolean(fileUrl));
  const [error, setError] = useState<string | null>(() => (fileUrl ? null : 'No se proporcionó ningún archivo.'));

  useEffect(() => {
    let isMounted = true;

    const parseExcel = async () => {
      try {
        setLoading(true);
        setError(null);

        let arrayBuffer: ArrayBuffer;

        const isFileLike = (value: unknown): value is File | Blob => {
          return typeof value === 'object' && value !== null && 'arrayBuffer' in value && typeof (value as { arrayBuffer?: unknown }).arrayBuffer === 'function';
        };

        if (isFileLike(fileUrl)) {
          arrayBuffer = await fileUrl.arrayBuffer();
        } else if (typeof fileUrl === 'string' && fileUrl.trim() !== '' && fileUrl !== '#') {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Error en el servidor al obtener el archivo (${response.status})`);
          }
          arrayBuffer = await response.arrayBuffer();
        } else {
          throw new Error('La ruta del archivo no es válida o aún no se ha subido a un almacenamiento público.');
        }

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const parsedSheets: Record<string, SheetData> = {};

        workbook.SheetNames.forEach((name) => {
          const worksheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as SheetData;
          parsedSheets[name] = jsonData;
        });

        if (isMounted) {
          setSheets(parsedSheets);
          setSheetNames(workbook.SheetNames);
          if (workbook.SheetNames.length > 0) {
            setActiveSheet(workbook.SheetNames[0]);
          }
        }
      } catch (err: unknown) {
        console.error('Error procesando Excel:', err);
        if (isMounted) {
          const message = err instanceof Error ? err.message : String(err);
          setError(
            message.includes('Failed to fetch')
              ? 'No se pudo descargar el archivo debido a restricciones de red/CORS o la URL no existe.'
              : message || 'No se pudo procesar el archivo Excel.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (fileUrl) {
      parseExcel();
    }

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-mono">Cargando hoja de cálculo...</p>
      </div>
    );
  }

  if (error || !activeSheet || !sheets[activeSheet]) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-3 p-4 text-center">
        <AlertCircle className="w-10 h-10 text-accent opacity-90" />
        <p className="text-sm font-medium text-text">No se pudo mostrar la vista previa</p>
        <p className="text-xs text-text-secondary max-w-md">{error || 'El archivo Excel está vacío o dañado.'}</p>
      </div>
    );
  }

  const currentData = sheets[activeSheet] ?? [];
  const headers = (currentData[0] as unknown[]) || [];
  const rows = currentData.slice(1) as unknown[][];

  return (
    <div className="flex flex-col h-full bg-surface-1 rounded-2xl border border-border overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-surface-2 text-text-secondary font-mono border-b border-border">
              <th className="py-2 px-3 w-10 text-center text-text-secondary bg-surface-3 border-r border-border">#</th>
              {headers.map((cell, idx) => (
                <th key={idx} className="py-2.5 px-4 font-semibold border-r border-border whitespace-nowrap text-text">
                  {cell !== undefined ? String(cell) : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surface-2 transition-colors">
                <td className="py-2 px-3 text-center text-text-secondary font-mono bg-surface-3 border-r border-border text-[10px]">
                  {rowIndex + 1}
                </td>
                {headers.map((_, colIndex) => {
                  const cellValue = row[colIndex] as unknown;
                  return (
                    <td key={colIndex} className="py-2 px-4 border-r border-border whitespace-nowrap">
                      {cellValue !== undefined ? String(cellValue) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sheetNames.length > 1 && (
        <div className="bg-surface-2 border-t border-border px-4 py-2 flex items-center space-x-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-mono uppercase text-text-secondary mr-2">Hojas:</span>
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveSheet(name)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeSheet === name
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-text-secondary hover:bg-surface-3 hover:text-text'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
