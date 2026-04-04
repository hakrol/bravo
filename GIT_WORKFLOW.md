# Git Workflow – Prosjektstandard

## 📌 Prinsipp

* `main` = stabil kode (produksjon)
* aldri jobb direkte i `main`
* alt arbeid skjer i egne branches

---

## 🌱 Starte ny feature

```bash
git checkout main
git pull
git checkout -b feature/navn-pa-feature
```

---

## 🔁 Bytte branch

```bash
git switch branch-navn
```

---

## 📋 Se branches

```bash
git branch        # lokale
git branch -a     # alle (inkl. remote)
```

---

## 💾 Lagre endringer

```bash
git add .
git commit -m "Beskrivelse av endring"
```

---

## ☁️ Push branch (første gang)

```bash
git push -u origin feature/navn-pa-feature
```

Senere:

```bash
git push
```

---

## 🔀 Merge til main

```bash
git checkout main
git pull
git merge feature/navn-pa-feature
git push
```

---

## 🧹 Slette branch

```bash
git branch -d feature/navn-pa-feature
git push origin --delete feature/navn-pa-feature
```

---

## ⚠️ Hvis du har endringer og må bytte branch

```bash
git stash
git switch annen-branch
git stash pop
```

---

## 🧠 Naming convention

* feature: `feature/lonnsfilter`
* bugfix: `fix/api-feil`
* refactor: `refactor/frontend`

---

## 🚀 Standard workflow (kortversjon)

```bash
git checkout main
git pull
git checkout -b feature/navn

# jobb...
git add .
git commit -m "..."

git push -u origin feature/navn

# ferdig:
git checkout main
git merge feature/navn
git push
```

---

## ❗ Viktige regler

* ❌ aldri commit direkte i main
* ✅ alltid pull før du lager ny branch
* ✅ små, isolerte branches
* ✅ skriv tydelige commit-meldinger

---
