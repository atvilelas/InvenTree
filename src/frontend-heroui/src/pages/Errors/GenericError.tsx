import { Trans } from "@lingui/react/macro";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "@lib/contexts/LanguageProvider";
import { Alert } from "@lib/images/Alert";
import { LinkBack } from "@lib/images/LinkBack";

import { Center } from "@/components/replacements/Center";
import { Container } from "@/components/replacements/Container";
import { Group } from "@/components/replacements/Group";
import { Stack } from "@/components/replacements/Stack";
import { Text } from "@/components/replacements/Text";

export const GenericError = ({
  title,
  message,
  status,
}: Readonly<{
  title: string;
  message: string;
  status?: number;
  redirectMessage?: string;
  redirectTarget?: string;
}>) => {
  const navigate = useNavigate();

  return (
    <LanguageContext>
      <Center>
        <Container>
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
          >
            <CardHeader>
              <Group>
                <Alert size="lg" />
                <Text>{title}</Text>
              </Group>
            </CardHeader>
            <CardBody>
              <Stack>
                <Text>{message}</Text>
                {status && (
                  <Text>
                    <Trans>Status Code</Trans>: {status}
                  </Text>
                )}
              </Stack>
              <Divider />
              <Center>
                <Button
                  color="success"
                  variant="light"
                  onPress={() => navigate("/")}
                >
                  <Trans>Return to the index page</Trans>
                  <LinkBack />
                </Button>
              </Center>
            </CardBody>
          </Card>
        </Container>
      </Center>
    </LanguageContext>
  );
};
