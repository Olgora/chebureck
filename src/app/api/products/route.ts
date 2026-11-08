import { ProductService } from "@/services/product/service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const products = isAdmin
      ? await ProductService.getAllAdmin()
      : await ProductService.getAll();

    return Response.json(products);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Fetch error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await ProductService.create(body);
    return Response.json(product);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Create error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    await ProductService.update(id, data);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Update error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await ProductService.delete(id);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Delete error" }, { status: 500 });
  }
}



/*import { ProductService } from "@/services/product/service";

export async function GET() {
  const products = await ProductService.getAll();
  return Response.json(products);
}

// ======================
// CREATE
// ======================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await ProductService.create(body);

    return Response.json(product);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Create error" }, { status: 500 });
  }
}

// ======================
// UPDATE
// ======================
export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();

    await ProductService.update(id, data);

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Update error" }, { status: 500 });
  }
}

// ======================
// DELETE
// ======================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await ProductService.delete(id);

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Delete error" }, { status: 500 });
  }
}*/