import { useState, useEffect } from "react";
import Head from "next/head";
import { Heading } from "@chakra-ui/react";
import { Badge, Stack, HStack, VStack } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { CloseIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

import { type ToDo } from "../lib/todos";

import styles from "../styles/Home.module.css";

interface ToDoComponentProps {
  key: number;
  text: string;
  done: boolean;
  onChange: () => void;
  onRemove: () => void;
}

const ToDoComponent = ({
  text,
  done,
  onChange,
  onRemove,
}: ToDoComponentProps) => {
  const cards = ["card", "card2", "card3", "card4", "card5"];

  return (
    <div className={styles[cards[Math.floor(Math.random() * cards.length)]]}>
      <div
        className={styles.text}
        style={{ textDecoration: done ? "line-through" : "" }}
      >
        <Checkbox
          type="checkbox"
          defaultChecked={done}
          onChange={onChange}
          mr={2}
        ></Checkbox>
        {text}
      </div>
      <div className={styles.reverseWrapper}>
        <Badge colorScheme={done ? "green" : "purple"}>
          {done ? "Done" : "In Progress"}
        </Badge>
        <IconButton
          aria-label="Remove Todo"
          icon={<CloseIcon />}
          className={styles.removeBtn}
          onClick={onRemove}
          ml={2}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [newText, setNewText] = useState("");
  const [toDos, setToDos] = useState<ToDo[]>([]);

  const getToDos = async () => {
    const resp = await fetch("api/todos");
    const toDos = await resp.json();
    setToDos(toDos);
  };

  const createToDo = async () => {
    await fetch("api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    setNewText("");

    await getToDos();
  };

  const updateToDo = async (todo: ToDo) => {
    const newBody = {
      id: todo.id,
      done: !todo.done,
    };

    await fetch("api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBody),
    });

    await getToDos();
  };

  const removeToDo = async (todo: ToDo) => {
    const newBody = {
      id: todo.id,
    };

    await fetch("api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBody),
    });

    await getToDos();
  };

  useEffect(() => {
    getToDos();
  }, []);

  const done = toDos.filter((todo) => todo.done);
  const undone = toDos.filter((todo) => !todo.done);

  return (
    <div>
      <Head>
        <title>postgres.js + next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.undone}>
          <div className={styles.firstRow}>
            <Heading
              color="#CBD5E0
"
              as="h3"
              size="lg"
            >
              To dos
            </Heading>
            <div className={styles.reverseWrapper}>
              <Input
                variant="filled"
                placeholder="add to do"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.code === "Enter" && createToDo()}
              />

              <IconButton
                aria-label="Add Todo"
                icon={<AddIcon />}
                className={styles.createBtn}
                onClick={createToDo}
                ml={2}
              />
            </div>
          </div>
          <div className={styles.scrollable}>
            {undone.map((todo, index) => (
              <ToDoComponent
                key={todo.id}
                text={`${index + 1}. ${todo.text}`}
                done={todo.done}
                onChange={() => updateToDo(todo)}
                onRemove={() => removeToDo(todo)}
              />
            ))}
          </div>
        </div>

        <div className={styles.done}>
          <div className={styles.firstRow}>
            <Heading color="#CBD5E0" as="h3" size="lg">
              Done
            </Heading>
          </div>
          <div className={styles.scrollable}>
            {done.map((todo, index) => (
              <ToDoComponent
                key={todo.id}
                text={`${index + 1}. ${todo.text}`}
                done={todo.done}
                onChange={() => updateToDo(todo)}
                onRemove={() => removeToDo(todo)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
