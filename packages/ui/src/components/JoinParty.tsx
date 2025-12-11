import { Box, Button, Flex, TextField, Text, Heading } from "@radix-ui/themes";
import { useMemo, useState } from "react";

export const JoinParty = () => {
  const [partyCode, setPartyCode] = useState("");
  const [name, setName] = useState("");

  const disableJoinButton = useMemo(() => {
    const noPartyCode = partyCode.trim().length === 0;
    const noName = name.trim().length === 0;
    return noPartyCode || noName;
  }, [partyCode, name]);

  function handleJoinParty() {
    console.log(`Joining party ${partyCode} as ${name}`);
  }

  return (
    <Flex
      width="100%"
      height="100dvh"
      direction="column"
      align="center"
      justify="between"
      px="8"
      py="6"
    >
      <Box width="100%">
        <Heading as="h2" size="8" mb="8" align="center">
          Join Party
        </Heading>

        <Box mb="5">
          <Text as="label" htmlFor="input-party-code">
            Party Code:
          </Text>
          <TextField.Root
            id="input-party-code"
            size="3"
            onChange={(e) => setPartyCode(e.target.value)}
          />
        </Box>

        <Box>
          <Text as="label" htmlFor="input-name">
            Name:
          </Text>
          <TextField.Root
            id="input-name"
            size="3"
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
      </Box>

      <Box width="100%">
        <Button
          size="4"
          className="full-width"
          onClick={handleJoinParty}
          disabled={disableJoinButton}
        >
          Join
        </Button>
      </Box>
    </Flex>
  );
};
