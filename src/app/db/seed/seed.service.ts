import { Injectable } from '@angular/core';
import { DEFAULT_ROLES } from './default-roles.seed';
import { RoleRepository } from '../../repositories/role.repository';

@Injectable({
  providedIn: 'root'
})
export class SeedService {

  constructor(private readonly roleRepository: RoleRepository) { }

  async initialize(): Promise<void> {
    console.info('SeedService: démarrage de l\'initialisation des données de seed');
    await this.seedRolesIfNeeded();
  }

  private async seedRolesIfNeeded(): Promise<void> {
    const existingRoles = await this.roleRepository.getAll();
    console.info(`SeedService: ${existingRoles.length} rôles existants trouvés`);

    const missingRoles = DEFAULT_ROLES.filter(role => !existingRoles.some(r => r.label === role.label));

    if (missingRoles.length === 0) {
      console.info('SeedService: seed déjà présent');
    } else {
      console.info(`SeedService: seed appliqué avec ${missingRoles.length} rôles insérés`);
      for (const role of missingRoles) {
        await this.roleRepository.create(role);
      }
    }
  }
}

