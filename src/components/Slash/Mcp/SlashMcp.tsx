import { useDialog, type DialogActions } from "@opentui-ui/dialog/react";
import { useEffect, useRef, useState } from "react";
import { upsertMcpServer } from "../../../utils/mcp";
import { Combobox } from "../../../ui/Combobox";
import { DialogHeader, DialogRoot } from "../../../ui/Dialog";
import type { InputRenderable, SelectOption } from "@opentui/core";
import type { McpServerConfig } from "../../../state/types";
import { useToast } from "../../../hooks/useToast";
import { useKeyboard } from "@opentui/react";

const STDIO_MODE = "stdio";
const REMOTE_MODE = "remote";

// headers come in as "Authorization: Bearer token, x-api-key: abc" (comma or newline separated)
// each entry is split on the first ":" so values containing colons stay intact
const parseHeaders = (raw: string): Record<string, string> => {
  const headers: Record<string, string> = {};
  raw
    .split(/[,\n]/)
    .map(entry => entry.trim())
    .filter(Boolean)
    .forEach(entry => {
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex === -1) return;
      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      if (!key || !value) return;
      headers[key] = value;
    });
  return headers;
};

// a pasted JSON blob in the first field is treated as a complete server config
// so the whole object can be submitted at once instead of filling each field
const parsePastedServer = (raw: string): McpServerConfig => {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("Malformed JSON dawg - paste a valid MCP server config");
  }

  const name = parsed.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error('Pasted config is missing a "name" dawg');
  }

  if (parsed.type === STDIO_MODE) {
    const command = parsed.command;
    if (typeof command !== "string" || !command.trim()) {
      throw new Error('Pasted stdio config is missing a "command" dawg');
    }
    const args = Array.isArray(parsed.args)
      ? parsed.args.filter((arg): arg is string => typeof arg === "string")
      : [];
    return {
      type: "stdio",
      name: name.trim(),
      command: command.trim(),
      args,
    };
  }

  if (parsed.type === REMOTE_MODE) {
    const url = parsed.url;
    if (typeof url !== "string" || !url.trim()) {
      throw new Error('Pasted remote config is missing a "url" dawg');
    }
    const headers =
      parsed.headers &&
      typeof parsed.headers === "object" &&
      !Array.isArray(parsed.headers)
        ? (parsed.headers as Record<string, string>)
        : undefined;
    return {
      type: "remote",
      name: name.trim(),
      url: url.trim(),
      ...(headers && Object.keys(headers).length ? { headers } : {}),
    };
  }

  throw new Error('Pasted config needs a "type" of "stdio" or "remote" dawg');
};

const SlashMcpDialog = () => {
  const nameRef = useRef<InputRenderable>(null)
  const commandRef = useRef<InputRenderable>(null)
  const argsRef = useRef<InputRenderable>(null)
  const urlRef = useRef<InputRenderable>(null)
  const headersRef = useRef<InputRenderable>(null)
  const [comboboxValue, setComboboxValue] = useState<
    SelectOption | undefined
  >();
  const dialog = useDialog();
  const { toast } = useToast();
  const isStdio = comboboxValue?.value === STDIO_MODE

  useEffect(() => {
    if (isStdio) nameRef.current?.focus()
  }, [isStdio, nameRef.current])

  useKeyboard(key => {
    if (key.name == "tab") {
      if (!nameRef.current?.focused) nameRef.current?.focus()
      else if (isStdio && !commandRef.current?.focused) commandRef.current?.focus()
      else if (isStdio) argsRef.current?.focus()
      else if (!urlRef.current?.focused) urlRef.current?.focus()
      else headersRef.current?.focus()
    }
  })

  const modeOptions = [
    {
      name: "stdio (local command)",
      value: STDIO_MODE,
      description: "run a local command like npx or uvx",
    },
    {
      name: "remote (url)",
      value: REMOTE_MODE,
      description: "connect to a remote MCP server over http",
    },
  ];

  const handleSubmit = () => {
    try {
      const name = nameRef?.current?.value || ""
      const rawName = name.trim()

      // a pasted full config in the first field short-circuits the manual flow
      if (rawName.startsWith("{")) {
        let server: McpServerConfig;
        try {
          server = parsePastedServer(rawName);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Malformed JSON dawg");
          return;
        }

        upsertMcpServer(server);

        toast.success(`${server.name} has been added!`);
        dialog.closeAll();
        return;
      }

      if (!comboboxValue) {
        toast.error("Server mode is missing dawg");
        return;
      }

      if (!name.trim()) {
        toast.error("Server name is missing");
        return;
      }

      let server: McpServerConfig;
      if (isStdio) {
        const command = commandRef?.current?.value || ""
        const rawArgs = (argsRef?.current?.value || "").trim()
        let args: string[]
        if (rawArgs.startsWith("[")) {
          // an explicit "[" signals JSON array intent, so never fall back to space splitting
          let parsed: unknown
          try {
            parsed = JSON.parse(rawArgs)
          } catch {
            toast.error('Malformed args array dawg - use ["arg1", "arg2"]');
            return;
          }
          if (!Array.isArray(parsed)) {
            toast.error('Malformed args array dawg - use ["arg1", "arg2"]');
            return;
          }
          if (!parsed.every((arg): arg is string => typeof arg === "string")) {
            toast.error("args array must only contain strings dawg");
            return;
          }
          args = parsed
        } else {
          args = rawArgs.split(" ").filter(Boolean)
        }

        if (!command.trim()) {
          toast.error("Command is missing");
          return;
        }

        server = {
          type: "stdio",
          name: name.trim(),
          command: command.trim(),
          args,
        };
      } else {
        const url = urlRef?.current?.value || ""
        const headersInput = (headersRef?.current?.value || "").trim()
        if (!url.trim()) {
          toast.error("URL is missing");
          return;
        }

        server = {
          type: "remote",
          name: name.trim(),
          url: url.trim(),
          ...(headersInput ? { headers: parseHeaders(headersInput) } : {}),
        };
      }

      upsertMcpServer(server);

      toast.success(`${server.name} has been added!`);
      dialog.closeAll();
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log("Something went wrong", error);
    }
  };

  return (
    <DialogRoot>
      <DialogHeader>
        {!comboboxValue
          ? "Choose an MCP server mode"
          : isStdio
            ? "Enter your MCP command details"
            : "Enter your MCP server url"}
      </DialogHeader>
      {!comboboxValue ? (
        <Combobox
          setSubmitValue={setComboboxValue}
          placeholder="MCP server mode"
          options={modeOptions}
        />
      ) : (
        <>
          <input
            ref={nameRef}
            placeholder="name (or paste a full server config as JSON)"
            onSubmit={handleSubmit}
            focused
          />
          {isStdio ? (
            <>
              <input
                ref={commandRef}
                placeholder="command (e.g. npx)"
                onSubmit={handleSubmit}
              />
              <input
                ref={argsRef}
                placeholder='args (space separated or ["json", "array"], optional)'
                onSubmit={handleSubmit}
              />
            </>
          ) : (
            <>
              <input
                ref={urlRef}
                placeholder="url"
                onSubmit={handleSubmit}
              />
              <text>
                <span style={{ fg: "grey" }}>
                  headers optional · key:value, comma separated
                </span>
              </text>
              <input
                ref={headersRef}
                placeholder="headers (optional)"
                onSubmit={handleSubmit}
              />
              <text>
                <span style={{ fg: "grey" }}>
                  e.g. Authorization: Bearer token, x-api-key: abc
                </span>
              </text>
            </>
          )}
          <text>
            enter <span style={{ fg: "grey" }}>submit</span>
          </text>
        </>
      )}
    </DialogRoot>
  );
};

export const SlashMcp = (dialog: DialogActions) => {
  dialog.show({ content: () => <SlashMcpDialog /> });
};
