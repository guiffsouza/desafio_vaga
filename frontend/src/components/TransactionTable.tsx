import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
  Button,
  HStack,
  Text,
  Select,
  Input,
  Stack,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import GenericButton from "./Button";

interface Client {
  _id: string;
  name: string;
  cpfCnpj: string;
}

interface Transaction {
  _id: string;
  clientId: Client;
  transactionId: string;
  date: string;
  value: number;
}

const PAGE_SIZE = 100;
const POLLING_INTERVAL = 5000;

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions?page=${currentPage}&limit=${PAGE_SIZE}&nome=${filterName}&startDate=${startDate}&endDate=${endDate}&sortBy=date&sortOrder=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error("Falha ao carregar os dados");
      }
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const intervalId = setInterval(() => {
      fetchTransactions();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [currentPage, filterName, startDate, endDate, sortOrder]);

  const handleClearFilters = () => {
    setFilterName("");
    setStartDate("");
    setEndDate("");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleFilterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Box color="red.500">Erro: {error}</Box>;
  }

  const displayedTransactions = transactions;

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("pt-BR", options);
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/delete", {
        method: "DELETE",
      });

      setLoading(false);

      if (response.ok) {
        alert("Todos os dados foram deletados com sucesso!");
      } else {
        alert("Falha ao deletar os dados: " + response.status);
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao deletar os dados:", error);
      alert("Ocorreu um erro ao deletar os dados.");
    }
  };

  return (
    <Box p={6} display="flex" alignItems="center" flexDirection="column">
      <Stack
        spacing={4}
        mb={32}
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
      >
        <HStack spacing={4}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} mr={8}>
              Filtrar por Nome
            </FormLabel>
            <Input
              p={4}
              value={filterName}
              onChange={handleFilterNameChange}
              placeholder="Filtrar por Nome"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} mr={8}>
              Data Inicial
            </FormLabel>
            <Input
              p={4}
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} mr={8}>
              Data Final
            </FormLabel>
            <Input
              p={4}
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} mr={8}>
              Ordenar
            </FormLabel>
            <Select
              sx={{ padding: "4px" }}
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <GenericButton
            label="Limpar"
            size="lg"
            onClick={handleClearFilters}
            p={4}
            borderStyle="1px solid"
            ml={4}
          />
          <GenericButton
            label="Deletar Dados"
            size="lg"
            onClick={handleDelete}
            p={4}
            borderStyle="1px solid"
            ml={4}
          />
        </HStack>
      </Stack>

      <Table variant="striped" colorScheme="gray" mb={32} width="100%">
        <Thead>
          <Tr>
            <Th p={4} fontSize="lg">
              ID da Transação
            </Th>
            <Th p={4} fontSize="lg">
              Cliente
            </Th>
            <Th p={4} fontSize="lg">
              CPF/CNPJ
            </Th>
            <Th p={4} fontSize="lg">
              Data
            </Th>
            <Th p={4} fontSize="lg">
              Valor
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayedTransactions.map((transaction) => (
            <Tr key={transaction._id}>
              <Td p={4} fontSize="md">
                {transaction.transactionId}
              </Td>
              <Td p={4} fontSize="md">
                {transaction.clientId.name}
              </Td>
              <Td p={4} fontSize="md">
                {transaction.clientId.cpfCnpj}
              </Td>
              <Td p={4} fontSize="md">
                {formatDate(transaction.date)}
                {/* {transaction.date} */}
              </Td>
              <Td p={4} fontSize="md">
                {transaction.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <HStack mt={4} justifyContent="center" mb={32}>
        <Text>{`Página ${currentPage} de ${totalPages}`}</Text>

        <Button
          cursor="pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          cursor="pointer"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próximo
        </Button>

        <Select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          width="100px"
          ml={4}
        >
          {[...Array(totalPages).keys()].map((page) => (
            <option key={page + 1} value={page + 1}>
              {page + 1}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
}
