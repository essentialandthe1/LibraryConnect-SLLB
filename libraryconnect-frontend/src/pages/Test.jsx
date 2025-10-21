import React from "react";
import { useFiles } from "../services/hooks/useFiles";

const Test = () => {
  const { fetchFiles } = useFiles();
  const { data, isLoading, error } = fetchFiles;

  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files</p>;

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {data?.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
