"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTodos(parsed as Todo[]);
        }
      } catch (e) {
        console.error("Failed to parse todos");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos((prev) => [
        ...prev,
        { id: Date.now(), text: input.trim(), completed: false },
      ]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Todo App
      </h1>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="新しいタスクを入力..."
        />
        <button
          onClick={addTodo}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          追加
        </button>
      </div>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-4 p-5 bg-white rounded-lg shadow-sm"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
            />
            <span
              className={`flex-1 text-lg ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          まだタスクがありません。新しいタスクを追加しましょう！
        </p>
      )}
    </main>
  );
}
