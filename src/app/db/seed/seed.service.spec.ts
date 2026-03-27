import { TestBed } from '@angular/core/testing';

import { SeedService } from './seed.service';
import { RoleRepository } from '../../repositories/role.repository';

describe('SeedService', () => {
  let service: SeedService;
  let roleRepositorySpy: jasmine.SpyObj<RoleRepository>;

  beforeEach(() => {
    roleRepositorySpy = jasmine.createSpyObj('RoleRepository', ['getAll', 'create']);

    TestBed.configureTestingModule({
      providers: [
        SeedService,
        { provide: RoleRepository, useValue: roleRepositorySpy }
      ]
    });

    service = TestBed.inject(SeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not create roles when seed is already present', async () => {
    // Given : `getAll()` retourne les rôles par défaut
    roleRepositorySpy.getAll.and.resolveTo([
      { id: 1, label: 'Admin' },
      { id: 2, label: 'User' }
    ]);
    // When : `initialize()` est appelé
    await service.initialize();
    // Then : `create()` n'est jamais appelé
    expect(roleRepositorySpy.create).not.toHaveBeenCalled();
  });

  it('should create all default roles when no role exists', async () => {
    // Given : `getAll()` returns no roles
    roleRepositorySpy.getAll.and.resolveTo([]);
    // When : `initialize()` is called
    await service.initialize();
    // Then : `create()` is called for all default roles
    expect(roleRepositorySpy.create).toHaveBeenCalledTimes(2);
    expect(roleRepositorySpy.create).toHaveBeenCalledWith({ label: 'Admin' });
    expect(roleRepositorySpy.create).toHaveBeenCalledWith({ label: 'User' });
  });

  it('should create only missing roles when seed is partial', async () => {
    roleRepositorySpy.getAll.and.resolveTo([
      { id: 1, label: 'Admin' }
    ]);
    // When : `initialize()` is called
    await service.initialize();
    // Then : `create()` is called for the missing roles
    expect(roleRepositorySpy.create).toHaveBeenCalledTimes(1);
    expect(roleRepositorySpy.create).toHaveBeenCalledWith({ label: 'User' });
  });

  it('should handle create() error gracefully', async () => {
    // Given : getAll returns no roles, create will fail
    roleRepositorySpy.getAll.and.resolveTo([]);
    roleRepositorySpy.create.and.rejectWith(new Error('DB error'));
    // When : `initialize()` is called
    // Then : the service should either throw or handle the error properly
    await expectAsync(service.initialize()).toBeRejectedWithError('DB error');
  });
});
