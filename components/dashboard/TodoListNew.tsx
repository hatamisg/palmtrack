'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle, CheckCircle2, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTodosGroupedByDate, TodosByDate } from '@/lib/supabase/api/todos';
import { TodoItem } from '@/types';
import SwipeableTodoItem from './SwipeableTodoItem';

interface TodoListNewProps {
  limit?: number;
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
    console.log('Completing todo:', id);
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

  const renderSection = (title: string, todos: TodoItem[], icon: React.ReactNode, dotColor: string) => {
    if (todos.length === 0) return null;

    return (
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${dotColor}`} />
          <span className="text-xs sm:text-sm font-medium text-gray-600">{title}</span>
          <Badge variant="secondary" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 sm:px-2 bg-gray-100 text-gray-600">
            {todos.length}
          </Badge>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {todos.map((todo) => renderTodoItem(todo))}
        </div>
      </div>
    );
  };

  const allTodos = [
    ...todosGrouped.overdue,
    ...todosGrouped.today,
    ...todosGrouped.tomorrow,
    ...todosGrouped.thisWeek,
    ...todosGrouped.later,
  ];

  const hasMoreItems = limit && allTodos.length > limit;
  const displayCount = limit || allTodos.length;

  let remainingLimit = limit || Infinity;
  const limitedGrouped = { ...todosGrouped };

  if (limit) {
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
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
              <ListTodo className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
            Daftar Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs sm:text-sm text-gray-500">Memuat tugas...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allTodos.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
              <ListTodo className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
            Daftar Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3">
              <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Semua tugas selesai!
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Tidak ada tugas yang pending
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base lg:text-lg">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
              <ListTodo className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
            Daftar Tugas
          </div>
          <Badge variant="secondary" className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 border-blue-200">
            {allTodos.length} tugas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {renderSection(
            'Terlambat',
            limitedGrouped.overdue,
            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />,
            'bg-red-500'
          )}
          {renderSection(
            'Hari Ini',
            limitedGrouped.today,
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />,
            'bg-blue-500'
          )}
          {renderSection(
            'Besok',
            limitedGrouped.tomorrow,
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />,
            'bg-green-500'
          )}
          {renderSection(
            'Minggu Ini',
            limitedGrouped.thisWeek,
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />,
            'bg-orange-500'
          )}
          {renderSection(
            'Nanti',
            limitedGrouped.later,
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />,
            'bg-gray-400'
          )}

          {hasMoreItems && (
            <div className="text-center pt-2 pb-1">
              <p className="text-[10px] sm:text-xs text-gray-400">
                Menampilkan {displayCount} dari {allTodos.length} tugas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
