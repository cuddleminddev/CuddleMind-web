import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/components/alert/service/alert.service';
import { PlanServiceService } from '../services/plan-service.service';
import { Plan } from '../models/plans';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-plans-list',
  imports: [CommonModule, ReactiveFormsModule, NgbTooltipModule, FilterPipe, FormsModule, PaginationComponent],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.css'
})
export class PlansListComponent implements OnInit {
  planForm: FormGroup;
  plans: Plan[] = [];
  editingPlanId: string | null = null;
  filterText!: string;
  loading: boolean = true;

  totalPlans!: number;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedPlans: Plan[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private service: PlanServiceService
  ) {
    this.planForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, this.positiveIntegerValidator]],
      validity: ['', [Validators.required, this.positiveIntegerValidator]],
      bookings: ['', [Validators.required, this.positiveIntegerValidator]],
      // description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadPlansList()
  }

  loadPlansList() {
    this.loading = true;
    this.service.getPlansList().subscribe({
      next: (res) => {
        this.plans = res.data || []
        this.totalPlans = this.plans.length;
        this.updatePaginatedPlans();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.alertService.showAlert({
          message: 'Failed to fetch plans. Please try again.',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    })
  }

  positiveIntegerValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (val === null || val === '' || val === undefined) {
      return null; // Let 'required' handle empty values
    }

    const numberVal = +val;
    if (isNaN(numberVal) || numberVal <= 0 || !Number.isInteger(numberVal)) {
      return { positiveInteger: true };
    }

    return null;
  }

  openModal(content: any, plan?: Plan) {
    const buttonElement = document.activeElement as HTMLElement
    buttonElement.blur();

    if (plan) {
      this.editingPlanId = plan.id;
      this.planForm.patchValue({
        planName: plan.name,
        amount: plan.amount,
        validity: plan.timePeriod,
        bookings: plan.bookingFrequency,
      });
    } else {
      this.editingPlanId = null;
      this.planForm.reset();
    }

    this.modalService.open(content);
  }

  onSave(modal: any) {
    if (this.planForm.valid) {
      const formPlan = this.planForm.value;
      const planData = {
        name: formPlan.planName,
        bookingFrequency: +formPlan.bookings,
        timePeriod: +formPlan.validity,
        amount: +formPlan.amount
      };

      if (this.editingPlanId) {
        this.service.updatePlan(this.editingPlanId, planData).subscribe({
          next: (res) => {
            this.alertService.showAlert({
              message: 'Plan updated successfully',
              type: 'success',
              autoDismiss: true,
              duration: 4000
            });
            this.loadPlansList();
            this.planForm.reset();
            modal.close('Save click');
            this.editingPlanId = null;
          },
          error: () => {
            this.alertService.showAlert({
              message: 'Failed to update plan. Please try again.',
              type: 'error',
              autoDismiss: true,
              duration: 4000
            });
          }
        });
      } else {
        this.service.createPlan(planData).subscribe({
          next: () => {
            this.alertService.showAlert({
              message: 'Plan Created',
              type: 'success',
              autoDismiss: true,
              duration: 4000
            });
            this.loadPlansList();
            this.planForm.reset();
            modal.close('Save click');
          },
          error: () => {
            this.alertService.showAlert({
              message: 'Failed to create plan. Please try again.',
              type: 'error',
              autoDismiss: true,
              duration: 4000
            });
          }
        });
      }
    } else {
      this.planForm.markAllAsTouched();
    }
  }

  close() {
    this.planForm.reset()
    this.editingPlanId = null;
    this.modalService.dismissAll()
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedPlans();
  }

  onItemsPerPageChange(limit: number) {
    this.itemsPerPage = limit;
    this.currentPage = 1;
    this.updatePaginatedPlans();
  }

  updatePaginatedPlans() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedPlans = this.plans.slice(startIndex, endIndex);
  }

}
