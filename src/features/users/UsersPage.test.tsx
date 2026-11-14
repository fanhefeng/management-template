import { it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersPage } from "./UsersPage";

const pending = vi.hoisted(() => ({ resolve: (() => {}) as () => void }));
vi.mock("./api", () => ({
  usersQuery: { queryKey: ["users"], queryFn: async () => [] },
  saveUser: () =>
    new Promise<void>((resolve) => {
      pending.resolve = resolve;
    }),
  roleLabel: {},
  statusLabel: {},
}));
vi.mock("@/app/notify/store", () => ({ notify: { success: vi.fn() } }));
vi.mock("@/ui", () => ({
  Button: ({ children, loading, ...props }: any) => (
    <button {...props} disabled={loading}>
      {children}
    </button>
  ),
  Table: ({ onRowClick }: any) => (
    <button onClick={() => onRowClick({ id: 2, name: "Second", email: "second@example.com" })}>
      Open second
    </button>
  ),
  Modal: ({ open, title, children, footer }: any) =>
    open ? (
      <section aria-label={title}>
        {children}
        {footer}
      </section>
    ) : null,
  Input: ({ label, onChange, ...props }: any) => (
    <label>
      {label}
      <input {...props} onChange={(event) => onChange(event.target.value)} />
    </label>
  ),
}));

it("does not close a new editor when an earlier save finishes", async () => {
  const client = new QueryClient();
  client.setQueryData(["users"], []);
  render(
    <QueryClientProvider client={client}>
      <UsersPage />
    </QueryClientProvider>,
  );
  await userEvent.click(screen.getByText("新建用户"));
  await userEvent.type(screen.getByLabelText("姓名"), "First");
  await userEvent.type(screen.getByLabelText("邮箱"), "first@example.com");
  await userEvent.click(screen.getByText("保存"));
  await userEvent.click(screen.getByText("取消"));
  await userEvent.click(screen.getByText("Open second"));
  await act(async () => pending.resolve());
  expect(screen.getByLabelText("姓名")).toHaveValue("Second");
});
