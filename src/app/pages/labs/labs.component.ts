import { Component, signal } from '@angular/core';


@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss'
})
export class LabsComponent {
  title = 'Labs Page';
  welcome = 'Retoma de Desarrollo en Angular'
  tasks = signal([
    'Instalar Angular',
    'Configurar Angular',
    'Probar'
  ])

  name = signal('Maycol');

  changeEvent(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }
}
