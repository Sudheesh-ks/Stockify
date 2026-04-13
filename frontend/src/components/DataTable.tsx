import { Edit, Trash2 } from 'lucide-react';
import Loading from './Loading';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  idField?: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  idField = '_id',
  isLoading,
  emptyMessage = 'No records found.',
}: DataTableProps<T>) => {
  if (isLoading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-[#0d1117] rounded-xl border border-[#1a1f2a]">
        <p className="text-gray-500 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-[#0d1117] rounded-xl border border-[#1a1f2a]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#1a1f2a]">
          <thead className="bg-[#151b23]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1f2a]">
            {data.map((item, idx) => (
              <tr key={item[idField] || idx} className="hover:bg-[#11161f] transition-colors duration-150 group">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor as keyof T]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item[idField])}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
