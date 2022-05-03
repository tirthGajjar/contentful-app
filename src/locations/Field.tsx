import React, { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  FormControl,
  Grid,
  Heading,
  Paragraph,
  Stack,
  TextInput,
} from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import slugify from "slugify";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [entries, setEntries] = useState<any[]>([]);
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  const cma = useCMA();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  useEffect(() => {
    cma.entry.get({ entryId: sdk.ids.entry }).then((entries) => {
      console.log(entries);
      setEntries(
        entries.fields.content["en-US"].content
          .filter((e: { nodeType: string }) => e.nodeType.includes("heading"))
          .map((entry: any) => {
            return {
              title: entry?.content[0].value,
              slug: slugify(entry?.content[0].value),
              include: true,
            };
          })
      );
    });
  }, [cma.entry, sdk.ids.entry]);

  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <Grid
      style={{ width: "100%", padding: "8px" }}
      columns="repeat(1, 1fr)"
      columnGap="spacingM"
      rowGap="spacing3Xl"
      marginTop="spacingM"
    >
      {entries.map((entry: any, idx) => {
        return (
          <Grid.Item key={idx}>
            <Stack
              flexDirection="column"
              spacing="spacingM"
              alignItems="start"
              fullWidth
            >
              <Heading>{entry.title}</Heading>
              <Stack
                justifyContent="space-between"
                alignItems="start"
                fullWidth
              >
                <Checkbox defaultChecked={entry.include}>
                  Include in the TOC?
                </Checkbox>
                <FormControl isRequired={entry.include}>
                  <FormControl.Label>Slug</FormControl.Label>
                  <TextInput defaultValue={entry.slug} />
                </FormControl>
              </Stack>
            </Stack>
          </Grid.Item>
        );
      })}
    </Grid>
  );
};

export default Field;
