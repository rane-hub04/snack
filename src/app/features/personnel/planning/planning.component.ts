import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interface pour définir la structure d'un planning journalier
 * - day: nom du jour de la semaine
 * - startTime: heure d'arrivée (format HH:MM ou 'OFF' pour congé)
 * - endTime: heure de départ (format HH:MM ou 'OFF' pour congé)
 */
interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

/**
 * Interface pour définir la structure d'un employé
 * - id: identifiant unique de l'employé
 * - name: nom complet de l'employé
 * - position: poste/fonction de l'employé
 * - schedules: tableau contenant les horaires pour chaque jour de la semaine
 */
interface Employee {
  id: number;
  name: string;
  position: string;
  schedules: Schedule[];
}

/**
 * PlanningComponent - Composant pour la gestion du planning hebdomadaire
 * 
 * Fonctionnalités :
 * - Afficher la liste des employés
 * - Consulter le planning hebdomadaire de chaque employé
 * - Modifier les horaires d'un employé
 * - Ajouter un nouvel employé avec son planning
 * - Supprimer un employé
 * 
 * @standalone Le composant est indépendant et ne nécessite pas de module NgModule
 */
@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  // Liste de tous les employés de l'application
  employees: Employee[] = [];
  
  // Tableau des jours de la semaine en français
  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Employé actuellement sélectionné pour afficher/modifier ses horaires
  selectedEmployee: Employee | null = null;
  
  // Flag pour afficher/masquer le formulaire d'ajout d'employé
  showAddForm = false;
  
  // Objet temporaire pour stocker les données du nouvel employé en cours de création
  newEmployee: Partial<Employee> = { name: '', position: '', schedules: [] };

  /**
   * Initialisation du composant
   * Charge les données des employés au démarrage
   */
  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Charge les employés avec leurs planning hebdomadaire
   * Actuellement charge des données de test/exemple
   * À remplacer par un appel à un service pour récupérer les données d'une base de données
   */
  loadEmployees(): void {
    // Données de test avec 3 employés exemple
    this.employees = [
      {
        id: 1,
        name: 'Alice Dupont',
        position: 'Cuisinier',
        schedules: [
          { day: 'Lundi', startTime: '09:00', endTime: '17:00' },
          { day: 'Mardi', startTime: '09:00', endTime: '17:00' },
          { day: 'Mercredi', startTime: '09:00', endTime: '17:00' },
          { day: 'Jeudi', startTime: '09:00', endTime: '17:00' },
          { day: 'Vendredi', startTime: '09:00', endTime: '17:00' },
          { day: 'Samedi', startTime: 'OFF', endTime: 'OFF' },
          { day: 'Dimanche', startTime: 'OFF', endTime: 'OFF' }
        ]
      },
      {
        id: 2,
        name: 'Jean Martin',
        position: 'Serveur',
        schedules: [
          { day: 'Lundi', startTime: '11:00', endTime: '22:00' },
          { day: 'Mardi', startTime: '11:00', endTime: '22:00' },
          { day: 'Mercredi', startTime: 'OFF', endTime: 'OFF' },
          { day: 'Jeudi', startTime: '11:00', endTime: '22:00' },
          { day: 'Vendredi', startTime: '11:00', endTime: '23:00' },
          { day: 'Samedi', startTime: '11:00', endTime: '23:00' },
          { day: 'Dimanche', startTime: '11:00', endTime: '22:00' }
        ]
      },
      {
        id: 3,
        name: 'Yasmine Kipre',
        position: 'Manager',
        schedules: [
          { day: 'Lundi', startTime: '08:00', endTime: '16:00' },
          { day: 'Mardi', startTime: '08:00', endTime: '16:00' },
          { day: 'Mercredi', startTime: '08:00', endTime: '16:00' },
          { day: 'Jeudi', startTime: 'OFF', endTime: 'OFF' },
          { day: 'Vendredi', startTime: '08:00', endTime: '16:00' },
          { day: 'Samedi', startTime: 'OFF', endTime: 'OFF' },
          { day: 'Dimanche', startTime: 'OFF', endTime: 'OFF' }
        ]
      }
    ];
  }

  /**
   * Sélectionne un employé et ferme le formulaire d'ajout
   * @param employee - L'employé à sélectionner
   */
  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showAddForm = false;
  }

  /**
   * Récupère le planning d'un employé pour un jour donné
   * @param employee - L'employé concerné
   * @param day - Le jour de la semaine
   * @returns Le planning du jour ou undefined s'il n'existe pas
   */
  getScheduleForDay(employee: Employee, day: string): Schedule | undefined {
    return employee.schedules.find(s => s.day === day);
  }

  /**
   * Vérifie si un jour est un jour travaillé
   * @param schedule - Le planning du jour
   * @returns true si c'est un jour travaillé, false si congé ou undefined
   */
  isWorkDay(schedule: Schedule | undefined): boolean {
    return schedule ? schedule.startTime !== 'OFF' : false;
  }

  /**
   * Ouvre le formulaire d'ajout d'employé
   * Initialise un nouvel objet Employee avec un planning vierge pour tous les jours
   */
  openAddForm(): void {
    this.showAddForm = true;
    // Crée un planning vide pour chaque jour de la semaine
    this.newEmployee = { 
      name: '', 
      position: '', 
      schedules: this.weekDays.map(day => ({
        day,
        startTime: '',
        endTime: ''
      })) 
    };
  }

  /**
   * Ferme le formulaire d'ajout d'employé et réinitialise les données
   */
  cancelAdd(): void {
    this.showAddForm = false;
    this.newEmployee = { name: '', position: '', schedules: [] };
  }

  /**
   * Sauvegarde un nouvel employé dans la liste
   * Vérifie que le nom et le poste sont remplis
   */
  saveEmployee(): void {
    if (this.newEmployee.name && this.newEmployee.position) {
      // Crée un nouvel objet Employee avec un ID auto-généré
      const employee: Employee = {
        id: this.employees.length + 1,
        name: this.newEmployee.name!,
        position: this.newEmployee.position!,
        schedules: this.newEmployee.schedules || []
      };
      // Ajoute l'employé à la liste
      this.employees.push(employee);
      // Ferme le formulaire
      this.cancelAdd();
    }
  }

  /**
   * Supprime un employé de la liste
   * @param id - L'ID de l'employé à supprimer
   */
  deleteEmployee(id: number): void {
    // Filtre l'employé de la liste
    this.employees = this.employees.filter(e => e.id !== id);
    // Si l'employé supprimé était sélectionné, désélectionne-le
    if (this.selectedEmployee?.id === id) {
      this.selectedEmployee = null;
    }
  }

  /**
   * Met à jour l'horaire d'un employé pour un jour et un type (arrivée/départ)
   * @param schedule - Le planning du jour à modifier
   * @param field - Le champ à modifier ('startTime' ou 'endTime')
   * @param value - La nouvelle valeur (format HH:MM)
   */
  updateSchedule(schedule: Schedule, field: 'startTime' | 'endTime', value: string): void {
    if (field === 'startTime') {
      schedule.startTime = value;
    } else {
      schedule.endTime = value;
    }
  }

  /**
   * Gère les changements d'horaire depuis les inputs HTML
   * Extrait la valeur de l'événement et l'envoie à updateSchedule
   * @param schedule - Le planning du jour
   * @param field - Le champ à modifier
   * @param event - L'événement du changement
   */
  onTimeChange(schedule: Schedule, field: 'startTime' | 'endTime', event: any): void {
    const value = event.target.value;
    this.updateSchedule(schedule, field, value);
  }
}
