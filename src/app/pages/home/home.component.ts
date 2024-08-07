import { Component, computed, effect, Inject, Injector, signal } from '@angular/core';

import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { Task } from '../models/task.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tasks = signal<Task[]>([])

  filter = signal("all")

  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    switch (filter) {
      case 'pending':
        return tasks.filter((task) =>!task.completed)
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  })

  newTask = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required
    ]
  })

  injector = new Inject(Injector);

  constructor () {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      this.tasks.set(JSON.parse(storage));
    }

    this.trackTask()
  }

  trackTask() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks))
    })
  }

  addTaskHandler(): void {
    this.addTask(this.newTask.value.trim());
    this.newTask.setValue('')
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask])
  }

  deleteTask(index: number): void {
    this.tasks.update((tasks) => tasks.filter((task, pos) => pos !== index))
  }

  completedTask(taskId: number) {
    console.log(taskId);
    this.tasks.update((tasks) => {
      return tasks.map((task, pos) => {
        if (pos === taskId) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task
      })
    })
  }

  editingTask(taskId: number) {
    console.log(taskId);
    this.tasks.update((tasks) => {
      return tasks.map((task, pos) => {
        if (pos === taskId) {
          return {
            ...task,
            editing: !task.editing
          }
        } else {
          return {
            ...task,
            editing: false
          }
        }
        return task
      })
    })
  }

  editTaskHandler(event: Event, taskId: number): void {
    const newTitleTask = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, pos) => {
        if (pos === taskId) {
          return {
            ...task,
            title: newTitleTask.value,
            editing: !task.editing
          }
        }
        return task
      })
    })
  }

  editingSaveTask(taskId: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, pos) => {
        if (pos === taskId) {
          return {
            ...task,
            editing: !task.editing
          }
        }
        return task
      })
    })
  }

  changeFilter(status: string) {
    this.filter.set(status)
  }
}
