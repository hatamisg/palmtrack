'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTodosGroupedByDate, TodosByDate } from '@/lib/supabase/api/todos';
import { TodoItem } from '@/types';
import SwipeableTodoItem from './SwipeableTodoItem';

interface TodoListNewProps {
  limit?: number; // Limit total items to display
}

export default function TodoListNew({ limit }: TodoListNewProps) {
  const [todosGrouped, setTodosGrouped] = useState<TodosByDate>({
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const grouped = await getTodosGroupedByDate();
      setTodosGrouped(grouped);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTodo = async (id: string) => {
    // TODO: Implement actual completion logic with API
    console.log('Completing todo:', id);
    // For now, just reload todos
    await loadTodos();
  };

  const renderTodoItem = (todo: TodoItem) => {
    return (
      <SwipeableTodoItem
        key={todo.id}
        todo={todo}
        onComplete={handleCompleteTodo}
      />
    );
  };

  const renderSection = (title: string, todos: TodoItem[], icon: React.ReactNode) => {
    if (todos.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary" className="text-xs">
            {todos.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {todos.map((todo) => renderTodoItem(todo))}
        </div>
      </div>
    );
  };

  // Calculate total todos and apply limit if specified
  const allTodos = [
    ...todosGrouped.overdue,
    ...todosGrouped.today,
    ...todosGrouped.tomorrow,
    ...todosGrouped.thisWeek,
    ...todosGrouped.later,
  ];

  const hasMoreItems = limit && allTodos.length > limit;
  const displayCount = limit || allTodos.length;

  // Apply limit to each section proportionally
  let remainingLimit = limit || Infinity;
  const limitedGrouped = { ...todosGrouped };

  if (limit) {
    // Prioritize overdue and today first
    limitedGrouped.overdue = todosGrouped.overdue.slice(0, remainingLimit);
    remainingLimit -= limitedGrouped.overdue.length;

    if (remainingLimit > 0) {
      limitedGrouped.today = todosGrouped.today.slice(0, remainingLimit);
      remainingLimit -= limitedGrouped.today.length;
    } else {
      limitedGrouped.today = [];
    }

    if (remainingLimit > 0) {
      limitedGrouped.tomorrow = todosGrouped.tomorrow.slice(0, remainingLimit);
      remainingLimit -= limitedGrouped.tomorrow.length;
    } else {
      limitedGrouped.tomorrow = [];
    }

    if (remainingLimit > 0) {
      limitedGrouped.thisWeek = todosGrouped.thisWeek.slice(0, remainingLimit);
      remainingLimit -= limitedGrouped.thisWeek.length;
    } else {
      limitedGrouped.thisWeek = [];
    }

    if (remainingLimit > 0) {
      limitedGrouped.later = todosGrouped.later.slice(0, remainingLimit);
    } else {
      limitedGrouped.later = [];
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daftar Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Memuat todo...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allTodos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daftar Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Tidak ada todo yang pending
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Semua perawatan dan masalah sudah ditangani
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5" />
            Daftar Tugas
          </div>
          <Badge variant="secondary" className="text-xs">{allTodos.length} item</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="space-y-3 md:space-y-4 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-2 smooth-scroll">
          {renderSection(
            'Terlambat',
            limitedGrouped.overdue,
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {renderSection(
            'Hari Ini',
            limitedGrouped.today,
            <Calendar className="h-4 w-4 text-blue-500" />
          )}
          {renderSection(
            'Besok',
            limitedGrouped.tomorrow,
            <Calendar className="h-4 w-4 text-green-500" />
          )}
          {renderSection(
            'Minggu Ini',
            limitedGrouped.thisWeek,
            <Calendar className="h-4 w-4 text-orange-500" />
          )}
          {renderSection(
            'Nanti',
            limitedGrouped.later,
            <Calendar className="h-4 w-4 text-gray-500" />
          )}

          {hasMoreItems && (
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Menampilkan {displayCount} dari {allTodos.length} todo
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
