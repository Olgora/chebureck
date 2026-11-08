import { IngredientService } from "@/services/ingredient/service";

// ======================
// GET (Получение всех ингредиентов)
// ======================
export async function GET() {
  try {
    const ingredients = await IngredientService.getAll();
    return Response.json(ingredients);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Fetch error" }, { status: 500 });
  }
}

// ======================
// CREATE (Создание ингредиента)
// ======================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ingredient = await IngredientService.create(body);

    return Response.json(ingredient);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Create error" }, { status: 500 });
  }
}

// ======================
// UPDATE (Обновление ингредиента)
// ======================
export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();

    await IngredientService.update(id, data);

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Update error" }, { status: 500 });
  }
}

// ======================
// DELETE (Удаление ингредиента)
// ======================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await IngredientService.delete(id);

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Delete error" }, { status: 500 });
  }
}