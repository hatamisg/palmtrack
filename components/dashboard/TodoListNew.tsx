'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, AlertCircle, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTodosGroupedByDate, TodosByDate } from '@/lib/supabase/api/todos';
import { TodoItem } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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

  const renderTodoItem = (todo: TodoItem) => {
    const isIssue = todo.type === 'issue';
    const isMaintenance = todo.type === 'maintenance';

    // Determine priority/severity for styling
    const isHighPriority =
      isIssue && todo.kategori === 'Parah';
    const isMediumPriority =
      isIssue && todo.kategori === 'Sedang';

    // Determine link based on type
    const targetTab = isIssue ? 'masalah' : 'perawatan';
    const link = `/kebun/${todo.gardenSlug}?tab=${targetTab}`;

    return (
      <Link
        key={todo.id}
        href={link}
        className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isIssue ? (
                <AlertCircle
                  className={`h-5 w-5 ${
                    isHighPriority
                      ? 'text-red-500'
                      : isMediumPriority
                      ? 'text-orange-500'
                      : 'text-yellow-500'
                  }`}
                />
              ) : (
                <Wrench className="h-5 w-5 text-blue-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{todo.judul}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {todo.gardenName}
                {todo.areaTerdampak && ` • Area: ${todo.areaTerdampak}`}
                {todo.penanggungJawab && ` • PJ: ${todo.penanggungJawab}`}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge
                  variant={isIssue ? 'destructive' : 'default'}
                  className="text-xs"
                >
                  {isIssue ? 'Masalah' : 'Perawatan'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {todo.kategori}
                </Badge>
                {todo.status && (
                  <Badge
                    variant={
                      todo.status === 'Terlambat' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {todo.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-muted-foreground">
              {format(new Date(todo.tanggal), 'dd MMM', { locale: localeId })}
            </div>
          </div>
        </div>
      </Link>
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
            Daftar To-Do
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
            Daftar To-Do
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daftar To-Do
          </div>
          <Badge variant="secondary">{allTodos.length} item</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
