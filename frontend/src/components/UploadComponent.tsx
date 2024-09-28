import { useState } from "react";
import { Button, Input, Box, Text } from "@chakra-ui/react";

export default function ButtonUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "text/plain") {
      setFile(uploadedFile);
      console.log("Arquivo selecionado:", uploadedFile);
      setMessage(null);
    } else {
      alert("Por favor, selecione um arquivo .txt");
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      setMessage("O processo pode levar alguns minutos para ser finalizado.");

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        setLoading(false);

        if (response.ok) {
          alert("Arquivo enviado com sucesso!");
        } else {
          alert("Falha ao enviar o arquivo: " + response.status);
        }
      } catch (error) {
        setLoading(false);
        console.error("Erro ao enviar o arquivo:", error);
        alert("Ocorreu um erro ao enviar o arquivo.");
      }
    } else {
      alert("Nenhum arquivo selecionado");
    }
  };

  return (
    <Box p={4} mb={16}>
      <Input type="file" accept=".txt" onChange={handleFileChange} mb={4} />
      <Button
        colorScheme="blue"
        outline="none"
        borderStyle="1px solid"
        onClick={handleUpload}
        isLoading={loading}
        loadingText="Enviando"
        ml={4}
        p={4}
        cursor="pointer"
      >
        Enviar
      </Button>

      {message && (
        <Text mt={4} color="gray.500" mb={4}>
          {message}
        </Text>
      )}
    </Box>
  );
}
