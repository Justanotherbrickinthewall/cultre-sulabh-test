import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onBulkAction: (action: 'select' | 'deselect') => void;
  loading: boolean;
}

export function BulkActions({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onBulkAction, 
  loading 
}: BulkActionsProps) {
  if (totalCount === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedCount === totalCount}
            onCheckedChange={onSelectAll}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedCount === 0 
              ? `Select all ${totalCount} designs`
              : `${selectedCount} of ${totalCount} designs selected`
            }
          </span>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('select')}
              disabled={loading}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {loading ? 'Selecting...' : 'Select All'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('deselect')}
              disabled={loading}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              {loading ? 'Removing...' : 'Remove All'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
