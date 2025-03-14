import { NextResponse } from "next/server"

// Reference to the same "database" from the main route
// let sections = [
//   {
//     id: "1",
//     sectionName: "2D",
//     courseProgram: "BSHM",
//   },
//   {
//     id: "2",
//     sectionName: "1A",
//     courseProgram: "BSIT",
//   },
// ]

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const id = params.id
//   const section = sections.find((s) => s.id === id)

//   if (!section) {
//     return NextResponse.json({ error: "Section not found" }, { status: 404 })
//   }

//   return NextResponse.json(section)
// }

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find the section
    const index = sections.findIndex((s) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // Validate required fields
    if (!data.sectionName || !data.courseProgram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the new section name already exists (excluding current section)
    if (
      sections.some(
        (section) =>
          section.sectionName === data.sectionName && section.courseProgram === data.courseProgram && section.id !== id,
      )
    ) {
      return NextResponse.json({ error: "Section already exists for this course program" }, { status: 400 })
    }

    // Update the section
    const updatedSection = {
      ...sections[index],
      sectionName: data.sectionName,
      courseProgram: data.courseProgram,
    }

    sections[index] = updatedSection

    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 })
  }
}

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const id = params.id

//   // Find the section
//   const index = sections.findIndex((s) => s.id === id)

//   if (index === -1) {
//     return NextResponse.json({ error: "Section not found" }, { status: 404 })
//   }

//   // Remove the section
//   sections = sections.filter((s) => s.id !== id)

//   return NextResponse.json({ success: true })
// }

