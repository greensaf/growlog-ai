<form onSubmit={handleSend} className="p-3">
  <div className="flex w-full justify-between items-center gap-2">
    {!isRecording ? (
      <Input
        placeholder="Press the button and speak..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1"
      />
    ) : (
      <div className="flex items-end gap-[2px] h-5 flex-1" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <div className="w-[2px] h-3 bg-[#536C4A] animate-[ping_0.8s_ease-in-out_infinite]"></div>
        <div className="w-[2px] h-5 bg-[#536C4A] animate-[ping_1.1s_ease-in-out_infinite]"></div>
        <div className="w-[2px] h-4 bg-[#536C4A] animate-[ping_0.9s_ease-in-out_infinite]"></div>
        <div className="w-[2px] h-2 bg-[#536C4A] animate-[ping_1.2s_ease-in-out_infinite]"></div>
        <div className="w-[2px] h-3 bg-[#536C4A] animate-[ping_1s_ease-in-out_infinite]"></div>
      </div>
    )}

    <Button
      type="button"
      size="sm"
      onClick={() => setIsRecording(!isRecording)}
      className={`w-[80px] font-semibold py-2 rounded-md transition-all text-center ${
        isRecording
          ? "bg-[#536C4A] text-white animate-pulse shadow-[0_0_10px_#536C4A]"
          : "bg-black text-red-600 hover:bg-gray-900"
      }`}
    >
      {isRecording ? (
        <span className="flex items-center gap-2 justify-center">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          AI
        </span>
      ) : (
        "REC"
      )}
    </Button>
  </div>
</form>