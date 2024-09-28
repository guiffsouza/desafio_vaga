import { Box, Flex, Heading } from "@chakra-ui/react";
import UploadComponent from "./UploadComponent";
import TransactionTable from "./TransactionTable";

export default function Dashboard() {
  return (
    <Flex direction="column" align="center">
      <Heading as="h1" size="lg" mt={16} mb={16}>
        Dashboard de Transações
      </Heading>
      <UploadComponent />
      <TransactionTable />
    </Flex>
  );
}
