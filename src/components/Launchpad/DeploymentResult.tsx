import * as LaunchPadInterface from "../utils/launchpad-types";
import { toast } from "sonner";
import { SonnerStyle } from "../utils/consts";
import { FaCopy } from "react-icons/fa6";

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!", {
    style: SonnerStyle,
  });
};

const isTokenResponse = (
  result:
    | LaunchPadInterface.TokenDeploymentResponse
    | LaunchPadInterface.CollectionDeploymentResponse
): result is LaunchPadInterface.TokenDeploymentResponse => {
  return "mint" in result;
};

const DeploymentResult: React.FC<LaunchPadInterface.DeploymentResultProps> = ({
  result,
  onClose,
}) => {


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full space-y-6">
        <h3 className="text-2xl font-bold text-yellow-400">
          Deployment Successful!
        </h3>
        {isTokenResponse(result) && result.mint && (
          <div>
            <div className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Token Address</p>
                <p className="text-white font-mono">{`${result.mint.slice(
                  0,
                  9
                )}........${result.mint.slice(-9)}`}</p>
              </div>
              <button
                onClick={() => copyToClipboard(result.mint)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaCopy className="text-yellow-400" />
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col items-start justify-between text-white mt-3">
              <p>Check your wallet to view your new token</p>
              <a
                href={`https://solscan.io/token/${result.mint}?cluster=devnet`}
                target="_blank"
                className="text-sm text-yellow-400 hover:underline"
              >
                Or view on solscan
              </a>
              <p>When swapping your token don&apos;t forget to transfer the token to the Escrow </p>
            </div>
          </div>
        )}
        {"collectionAddress" in result && (
          <div className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Collection Address</p>
              <p className="text-white font-mono">{`${result.collectionAddress.slice(
                0,
                9
              )}........${result.collectionAddress.slice(-9)}`}</p>
            </div>
            <button
              onClick={() => copyToClipboard(result.collectionAddress)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaCopy className="text-yellow-400" />
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeploymentResult;
