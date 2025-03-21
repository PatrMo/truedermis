"use client";

interface Prediction {
  class: string;
  probability: number;
}

interface CardProps {
  predictions: Prediction[];
}

const Card: React.FC<CardProps> = ({ predictions }) => {
  // Helper function to get a color based on probability
  const getColorClass = (probability: number): string => {
    if (probability > 0.7) return "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700";
    if (probability > 0.4) return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700";
    return "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700";
  };

  // Helper function to get description text based on probability
  const getConfidenceText = (probability: number): string => {
    if (probability > 0.7) return "High confidence prediction";
    if (probability > 0.4) return "Medium confidence prediction";
    return "Low confidence prediction";
  };

  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600 dark:text-gray-300">No prediction data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full px-4 sm:px-10 lg:px-20 pb-16">
      {predictions.map((prediction, index) => {
        const colorClass = getColorClass(prediction.probability);
        const confidenceText = getConfidenceText(prediction.probability);
        
        return (
          <div
            key={index}
            className={`w-full flex flex-col items-center justify-center text-center border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 ${colorClass}`}
          >
            <h3 className="text-3xl font-semibold dark:text-white">
              {prediction.class}
            </h3>
            <div className="mt-4 w-full max-w-md">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                      Confidence
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-800 dark:text-blue-200">
                      {(prediction.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${prediction.probability * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">
              {confidenceText}
            </p>
            {index === 0 && (
              <div className="mt-3 bg-blue-100 py-1 px-3 rounded-full text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Top prediction
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Card;