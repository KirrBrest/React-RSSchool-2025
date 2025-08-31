import React from 'react';
import { useState, useCallback } from 'react';
import type { ColumnOption, YearlyData } from '../../interfaces/interfaces';
import './ColumnSelector.css';

interface ColumnSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnOption[];
  onColumnsChange: (columns: ColumnOption[]) => void;
}

export const ColumnSelector = React.memo(function ColumnSelector({
  isOpen,
  onClose,
  columns,
  onColumnsChange,
}: ColumnSelectorProps) {
  const [localColumns, setLocalColumns] = useState<ColumnOption[]>(columns);

  const handleColumnToggle = useCallback(
    (key: keyof YearlyData) => {
      const updatedColumns = localColumns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      );
      setLocalColumns(updatedColumns);
    },
    [localColumns]
  );

  const handleSave = useCallback(() => {
    onColumnsChange(localColumns);
    onClose();
  }, [localColumns, onColumnsChange, onClose]);

  const handleCancel = useCallback(() => {
    setLocalColumns(columns);
    onClose();
  }, [columns, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Выбор столбцов для отображения</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="columns-list">
            {localColumns.map((column) => (
              <label key={column.key} className="column-option">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => handleColumnToggle(column.key)}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Отмена
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
});
