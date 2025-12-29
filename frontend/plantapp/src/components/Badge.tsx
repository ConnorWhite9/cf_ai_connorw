import type {Plant} from '../../types/index';

export const Badge: React.FC<{
  status: Plant['healthStatus'];
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'md' }) => {
  const colors = {
    healthy: 'bg-green-100 text-green-700 border-green-200',
    'needs-water': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
    thriving: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${colors[status]} ${sizes[size]}
      `}
    >
      {status.replace('-', ' ')}
    </span>
  );
};