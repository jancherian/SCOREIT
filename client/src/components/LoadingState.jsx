function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-full max-w-4xl space-y-4">
        <div className="h-10 w-2/3 rounded-lg bg-gray-300/30 animate-pulse" />
        <div className="h-6 w-1/3 rounded-lg bg-gray-300/30 animate-pulse" />
        <div className="h-48 w-full rounded-2xl bg-gray-300/20 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-gray-300/20 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-300/20 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-300/20 animate-pulse" />
        </div>
      </div>
      <div className="text-sm text-gray-400">{message}</div>
    </div>
  );
}

export default LoadingState;
