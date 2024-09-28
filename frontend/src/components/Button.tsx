import React from "react";
import { Button, HStack } from "@chakra-ui/react";

interface GenericButtonProps {
  label: string;
  size?: "sm" | "md" | "lg";
  onClick: () => void;
  p?: number;
  borderStyle?: string;
  ml?: number;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  label,
  size = "md",
  onClick,
  p = 4,
  borderStyle = "1px solid",
  ml = 0,
}) => {
  return (
    <HStack spacing={4}>
      <Button
        size={size}
        p={p}
        ml={ml}
        outline="none"
        border={borderStyle}
        cursor="pointer"
        onClick={onClick}
      >
        {label}
      </Button>
    </HStack>
  );
};

export default GenericButton;
