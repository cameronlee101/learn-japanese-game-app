function ContentsOf({ 
  params,
}: {
  params: { chapter: string, topic: string }
}) {
  return (
    <main className='main-center'>
      Contents of: {params.chapter} {params.topic}
    </main>
  );
}

export default ContentsOf;