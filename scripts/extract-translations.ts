import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const srcDir = path.resolve('src');
const messagesDir = path.resolve('messages');
const outputFile = path.resolve(messagesDir, 'en.json');

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationTree = { [key: string]: TranslationValue };

const extractedTranslations: TranslationTree = {};

function walk(dirPath: string): void {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (/\.(js|ts|jsx|tsx)$/.test(file)) {
      extractFromFile(fullPath);
    }
  }
}

function extractFromFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const translationFunctions = new Map<string, string>();

  const visit = (node: ts.Node): void => {
    collectTranslationFunctions(node, translationFunctions);
    collectTranslationCalls(node, translationFunctions);
    ts.forEachChild(node, visit);
  };

  const collectTranslationFunctions = (
    node: ts.Node,
    registry: Map<string, string>
  ): void => {
    if (!ts.isVariableDeclaration(node) || !node.initializer || !ts.isIdentifier(node.name)) {
      return;
    }

    if (!ts.isCallExpression(node.initializer)) {
      return;
    }

    const expression = node.initializer.expression;
    if (!ts.isIdentifier(expression)) {
      return;
    }

    if (expression.text !== 'useTranslations' && expression.text !== 'getTranslations') {
      return;
    }

    const namespace = getStaticString(node.initializer.arguments[0]);
    if (!namespace) {
      return;
    }

    registry.set(node.name.text, namespace);
  };

  const collectTranslationCalls = (
    node: ts.Node,
    registry: Map<string, string>
  ): void => {
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
      return;
    }

    const translatorName = node.expression.text;
    const namespace = registry.get(translatorName);
    if (!namespace) {
      return;
    }

    const key = getStaticString(node.arguments[0]);
    const optionsArg = node.arguments[1];
    const fallback = getFallbackValue(optionsArg);

    if (!key || !fallback) {
      return;
    }

    setNestedKey(extractedTranslations, `${namespace}.${key}`, fallback);
  };

  visit(sourceFile);
}

function getStaticString(node?: ts.Expression): string | undefined {
  if (!node) {
    return undefined;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isTemplateExpression(node)) {
    if (node.templateSpans.length > 0) {
      return undefined;
    }

    return node.head.text;
  }

  return undefined;
}

function getFallbackValue(node?: ts.Expression): string | undefined {
  if (!node || !ts.isObjectLiteralExpression(node)) {
    return undefined;
  }

  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const propertyName = getPropertyName(property.name);
    if (propertyName !== 'fallback') {
      continue;
    }

    return getStaticString(property.initializer);
  }

  return undefined;
}

function getPropertyName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
}

function setNestedKey(obj: TranslationTree, keyPath: string, value: string): void {
  const keys = keyPath.split('.');
  let current: TranslationTree = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
      return;
    }

    const existingValue = current[key];

    if (!existingValue || typeof existingValue === 'string') {
      current[key] = {};
    }

    current = current[key] as TranslationTree;
  });
}

function isPlainObject(value: TranslationValue | undefined): value is TranslationTree {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeTranslations(
  defaults: TranslationTree,
  existing: TranslationTree | undefined
): TranslationTree {
  const result: TranslationTree = {};
  const keys = new Set([
    ...Object.keys(defaults),
    ...Object.keys(existing ?? {}),
  ]);

  for (const key of keys) {
    const defaultValue = defaults[key];
    const existingValue = existing?.[key];

    if (isPlainObject(defaultValue)) {
      result[key] = mergeTranslations(
        defaultValue,
        isPlainObject(existingValue) ? existingValue : undefined
      );
      continue;
    }

    if (typeof existingValue === 'string' && existingValue.trim()) {
      result[key] = existingValue;
      continue;
    }

    if (typeof defaultValue === 'string') {
      result[key] = defaultValue;
      continue;
    }

    if (typeof existingValue === 'string') {
      result[key] = existingValue;
    }
  }

  return result;
}

function readJsonFile(filePath: string): TranslationTree | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as TranslationTree;
}

walk(srcDir);

fs.mkdirSync(messagesDir, { recursive: true });

const englishMessages = mergeTranslations(
  extractedTranslations,
  readJsonFile(outputFile)
);
fs.writeFileSync(outputFile, JSON.stringify(englishMessages, null, 2), 'utf8');

const localeFiles = fs
  .readdirSync(messagesDir)
  .filter((file) => file.endsWith('.json') && file !== 'en.json');

for (const localeFile of localeFiles) {
  const localePath = path.join(messagesDir, localeFile);
  const localeMessages = mergeTranslations(
    englishMessages,
    readJsonFile(localePath)
  );
  fs.writeFileSync(localePath, JSON.stringify(localeMessages, null, 2), 'utf8');
}

console.log(`✅ Translations written to ${outputFile} and synced to ${localeFiles.length} locale files`);
