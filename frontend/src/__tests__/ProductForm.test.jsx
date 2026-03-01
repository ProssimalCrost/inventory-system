import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/products/ProductForm';

describe('ProductForm', () => {
  it('renders create form with empty fields', () => {
    render(<ProductForm initial={null} onSave={vi.fn()} onClose={vi.fn()} loading={false} />);
    expect(screen.getByRole('heading', { name: /novo produto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i).value).toBe('');
    expect(screen.getByLabelText(/valor/i).value).toBe('');
  });

  it('renders edit form pre-filled', () => {
    const product = { name: 'Produto X', value: 99.99 };
    render(<ProductForm initial={product} onSave={vi.fn()} onClose={vi.fn()} loading={false} />);
    expect(screen.getByLabelText(/nome/i).value).toBe('Produto X');
    expect(screen.getByLabelText(/valor/i).value).toBe('99.99');
  });

  it('calls onSave with correct data on submit', () => {
    const onSave = vi.fn();
    render(<ProductForm initial={null} onSave={onSave} onClose={vi.fn()} loading={false} />);
    fireEvent.change(screen.getByLabelText(/nome/i),  { target: { value: 'Produto Novo' } });
    fireEvent.change(screen.getByLabelText(/valor/i), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(onSave).toHaveBeenCalledWith({ name: 'Produto Novo', value: 150 });
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(<ProductForm initial={null} onSave={vi.fn()} onClose={onClose} loading={false} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons while loading', () => {
    render(<ProductForm initial={null} onSave={vi.fn()} onClose={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled();
  });
});
