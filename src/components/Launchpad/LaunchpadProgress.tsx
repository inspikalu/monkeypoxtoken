import { DeploymentProgressProps } from '../utils/launchpad-types';
import { FaRocket, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export const LaunchpadProgress: React.FC<DeploymentProgressProps> = ({
  isVisible,
  progress
}) => {
  if (!isVisible || !progress) return null;

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <FaCheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <FaExclamationTriangle className="w-6 h-6 text-red-400" />;
      default:
        return <FaRocket className="w-6 h-6 text-yellow-400 animate-pulse" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full space-y-6">
        <div className="flex items-center space-x-4">
          {getStatusIcon()}
          <h3 className={`text-2xl font-bold ${getStatusColor()}`}>
            {progress.type === 'token' ? 'Token Deployment' : 'Collection Deployment'}
          </h3>
        </div>

        {/* Progress Bar */}
        {progress.progress !== undefined && progress.status !== 'completed' && progress.status !== 'error' && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        )}

        {/* Status Message */}
        <p className={`text-lg ${getStatusColor()}`}>
          {progress.message || 'Processing...'}
        </p>

        {/* Current Step */}
        {progress.step && progress.status !== 'completed' && progress.status !== 'error' && (
          <p className="text-gray-400 text-sm">
            Current step: {progress.step}
          </p>
        )}

        {/* Error Message */}
        {progress.status === 'error' && progress.error && (
          <p className="text-red-400 text-sm bg-red-400/10 p-4 rounded-lg">
            {progress.error}
          </p>
        )}
      </div>
    </div>
  );
};