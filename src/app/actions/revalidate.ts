'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateProducts() {
  revalidatePath('/', 'page');
  revalidatePath('/products', 'layout');
}

export async function revalidateNotices() {
  revalidatePath('/support', 'layout');
}

export async function revalidateDocuments() {
  revalidatePath('/resources', 'page');
}

export async function revalidateProjects() {
  revalidatePath('/projects', 'layout');
}

export async function revalidateCategories() {
  revalidatePath('/', 'page');
  revalidatePath('/products', 'layout');
}
