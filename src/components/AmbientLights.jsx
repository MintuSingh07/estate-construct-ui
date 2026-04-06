export const AmbientLights = ({ type }) => {
  if (type === 'vision') {
    return (
      <>
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      </>
    );
  }
  
  if (type === 'portfolio') {
    return (
      <>
        <div className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-[1]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[700px] h-[700px] bg-amber-800/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-[1]" />
      </>
    );
  }

  if (type === 'showcase') {
    return (
      <>
        <div className="absolute top-0 right-[20%] w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-[1]" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen z-[1]" />
      </>
    );
  }

  return null;
};
