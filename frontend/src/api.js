const API_BASE_URL = "http://127.0.0.1:8000";


async function request(endpoint, options = {}) {

    const isFormData =
        options.body instanceof FormData;


    const isGet =
        !options.method ||
        options.method.toUpperCase() === "GET";


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            cache: isGet
                ? "no-store"
                : options.cache,

            headers: {
                ...(isFormData
                    ? {}
                    : {
                        "Content-Type":
                            "application/json"
                    }),

                ...(options.headers || {})
            }
        }
    );


    let data = null;


    try {

        data = await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        const message =
            data?.detail ||
            data?.message ||
            `Request failed with status ${response.status}`;


        throw new Error(message);

    }


    return data;
}


// ============================================================
// DOCUMENTS
// ============================================================

export async function getDocuments() {

    return await request(
        "/documents/"
    );

}


export async function getDocument(
    documentId
) {

    return await request(
        `/documents/${documentId}`
    );

}


export async function uploadDocument(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    return await request(
        "/documents/upload",
        {
            method: "POST",

            body: formData
        }
    );

}


export async function deleteDocument(
    documentId
) {

    return await request(
        `/documents/${documentId}`,
        {
            method: "DELETE"
        }
    );

}


// ============================================================
// SEARCH
// ============================================================

export async function keywordSearch(
    payload
) {

    return await request(
        "/search/",
        {
            method: "POST",

            body:
                JSON.stringify(payload)
        }
    );

}


export async function semanticSearch(
    payload
) {

    return await request(
        "/semantic-search/",
        {
            method: "POST",

            body:
                JSON.stringify(payload)
        }
    );

}


export async function hybridSearch(
    payload
) {

    return await request(
        "/hybrid-search/",
        {
            method: "POST",

            body:
                JSON.stringify(payload)
        }
    );

}


// ============================================================
// HISTORY
// ============================================================

export async function getSearchHistory() {

    return await request(
        "/history/"
    );

}


export async function deleteSearchHistory() {

    return await request(
        "/history/",
        {
            method: "DELETE"
        }
    );

}